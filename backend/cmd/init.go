package main

import (
	"TKPM/common/flags"
	"TKPM/configs"
	"TKPM/internals/delivery"
	"TKPM/internals/domain"
	"TKPM/internals/models"
	"TKPM/internals/repository"
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"TKPM/pkg/token"

	"github.com/go-logr/logr"
	"github.com/go-logr/zapr"
	"github.com/opentracing/opentracing-go"
	"github.com/uber/jaeger-client-go/config"
	"github.com/urfave/cli"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
)

var (
	app          = NewApp()
	server       = new(srv)
	startCommand = cli.Command{
		Action:      flags.MigrateFlags(Start),
		Name:        "start",
		Usage:       "start server",
		ArgsUsage:   "<genesisPath>",
		Flags:       []cli.Flag{},
		Description: `start server`,
	}
)

type srv struct {
	cfg    *configs.Config
	logger logr.Logger

	mgoDB            *mongo.Database
	mgoClient        *mongo.Client
	mgoClientOptions *options.ClientOptions

	authenticator token.Authenticator
	mail          domain.Mail

	classDomain      domain.Class
	accountDomain    domain.Account
	invitationDomain domain.Invitation
	gradeDomain      domain.Grade
	assignmentDomain domain.Assignment
	csvDomain        domain.Csv

	classDelivery      delivery.ClassDelivery
	accountDelivery    delivery.AccountDelivery
	invitationDelivery delivery.InvitationDelivery
	gradeDelivery      delivery.GradeDelivery

	tracer opentracing.Tracer
}

func init() {
	app.Action = cli.ShowAppHelp
	app.Commands = []cli.Command{
		startCommand,
	}
	app.Flags = []cli.Flag{
		flags.ServerHostFlag,
		flags.ServerPortFlag,
		flags.ServerNameFlag,

		flags.MongoDatabaseNameFlag,
		flags.MongoHostFlag,
		flags.MongoPortFlag,

		flags.StorageAccessKeyFlag,
		flags.StorageSecretKeyFlag,
		flags.StorageRegionFlag,
		flags.StorageNameFlag,

		flags.JaegerHostFlag,
		flags.JaegerPortFlag,

		flags.TokenKeyFlag,
	}
}

func (s *srv) loadConfig(ctx *cli.Context) error {
	server.cfg = &configs.Config{
		HTTP: configs.ConnAddress{
			Host: ctx.GlobalString(flags.ServerHostFlag.GetName()),
			Port: ctx.GlobalString(flags.ServerPortFlag.GetName()),
		},
		Mongo: configs.Mongo{
			Host:     ctx.GlobalString(flags.MongoHostFlag.GetName()),
			Port:     ctx.GlobalString(flags.MongoPortFlag.GetName()),
			Database: ctx.GlobalString(flags.MongoDatabaseNameFlag.GetName()),
		},
		Storage: configs.Storage{
			AccessKey:  ctx.GlobalString(flags.StorageAccessKeyFlag.GetName()),
			SecretKey:  ctx.GlobalString(flags.StorageSecretKeyFlag.GetName()),
			BucketName: ctx.GlobalString(flags.StorageNameFlag.GetName()),
			Region:     ctx.GlobalString(flags.StorageRegionFlag.GetName()),
		},
		Tracer: configs.ConnAddress{
			Host: ctx.GlobalString(flags.JaegerHostFlag.GetName()),
			Port: ctx.GlobalString(flags.JaegerPortFlag.GetName()),
		},
		TokenKey:    ctx.GlobalString(flags.TokenKeyFlag.GetName()),
		ServiceName: ctx.GlobalString(flags.ServerNameFlag.GetName()),
	}
	return nil
}

func (s *srv) loadLogger() error {
	zapLog, err := zap.NewDevelopment()
	if err != nil {
		panic(err)
	}
	s.logger = zapr.NewLogger(zapLog)
	return nil
}

func (s *srv) connectMongo() error {
	// s.mgoClientOptions = options.Client().ApplyURI("mongodb://my_database:27017")
	s.mgoClientOptions = options.Client().ApplyURI("mongodb://localhost:27017/my_classroom_db")
	// connect to mongoDb
	var err error
	s.mgoClient, err = mongo.Connect(context.TODO(), s.mgoClientOptions)
	if err != nil {
		s.logger.Error(err, "fail to connect mongodb")
		return err
	}
	s.mgoDB = s.mgoClient.Database(s.cfg.Mongo.Database)
	s.logger.Info("connect mongodb successfull ")
	return nil
}

func (s *srv) loadMailer() error {
	s.mail = domain.NewMailer("email@gmail.com", "password", "smtp.gmail.com", "587")
	return nil
}

func (s *srv) loadTracing() error {
	cfg := config.Configuration{
		ServiceName: s.cfg.ServiceName,
		Sampler: &config.SamplerConfig{
			Type:  "const",
			Param: 1,
		},
		Reporter: &config.ReporterConfig{
			LogSpans:            false,
			BufferFlushInterval: 1 * time.Second,
			LocalAgentHostPort:  s.cfg.Tracer.Host + ":" + s.cfg.Tracer.Port,
		},
	}
	tracer, _, err := cfg.NewTracer()
	if err != nil {
		s.logger.Error(err, "fail to load tracing")
		return err
	}

	opentracing.SetGlobalTracer(tracer)

	s.tracer = tracer
	s.logger.Info("load tracing successfull ")
	return nil
}

func (s *srv) loadDomain() error {
	s.accountDomain = domain.NewAccountDomain(repository.NewAccountRepository(s.mgoDB.Collection(models.AccountCollection)), s.authenticator)
	s.classDomain = domain.NewClassDomain(repository.NewClassRepository(s.mgoDB.Collection(models.ClassCollection)))
	s.invitationDomain = domain.NewInvitationDomain(s.mail)
	s.assignmentDomain = domain.NewAssignmentDomain(repository.NewAssignmentRepository(s.mgoDB.Collection(models.AssignmentCollection)))
	s.gradeDomain = domain.NewGradeDomain(repository.NewGradeRepository(s.mgoDB.Collection(models.GradeCollection)))
	s.csvDomain = domain.NewCsvDomain()
	s.logger.Info("load domain successfull ")
	return nil
}

func (s *srv) loadDelivery() error {
	s.accountDelivery = delivery.NewAccountDelivery(s.accountDomain)
	s.classDelivery = delivery.NewClassDelivery(s.classDomain, s.csvDomain, s.cfg.Storage)
	s.invitationDelivery = delivery.NewInvitationDelivery(s.classDomain, s.invitationDomain)
	s.gradeDelivery = delivery.NewGradeDelivery(s.gradeDomain, s.assignmentDomain, s.csvDomain, s.cfg.Storage)
	s.logger.Info("load delivery successfull ")
	return nil
}

func (s *srv) loadAuthenticator() error {
	var err error
	s.authenticator, err = token.NewJWTAuthenticator(s.cfg.TokenKey, 15*24*time.Hour)
	return err
}

func (s *srv) startHTTPServer() {
	handler := delivery.NewHTTPHandler(s.classDelivery, s.accountDelivery, s.invitationDelivery, s.gradeDelivery, s.authenticator, s.accountDomain, s.classDomain)
	server := &http.Server{
		Addr:    s.cfg.HTTP.Host + ":" + s.cfg.HTTP.Port,
		Handler: delivery.AllowCORS(handler),
	}
	s.logger.Info(fmt.Sprintf("start http server at port %v\n", s.cfg.HTTP.Port))
	log.Fatal(server.ListenAndServe())
}

// NewApp creates an app with sane defaults.
func NewApp() *cli.App {
	app := cli.NewApp()
	app.Action = cli.ShowAppHelp
	app.Name = "Hotel management"
	app.Author = "Bui Hoan Hao"
	app.Email = "haopro@gmail.com"
	app.Usage = "Server API"
	return app
}

// Start ...
func Start(ctx *cli.Context) error {
	if err := server.loadConfig(ctx); err != nil {
		return err
	}

	if err := server.loadLogger(); err != nil {
		return err
	}

	if err := server.loadAuthenticator(); err != nil {
		return err
	}

	if err := server.connectMongo(); err != nil {
		return err
	}

	if err := server.loadMailer(); err != nil {
		return err
	}

	if err := server.loadTracing(); err != nil {
		return err
	}

	if err := server.loadDomain(); err != nil {
		return err
	}

	if err := server.loadDelivery(); err != nil {
		return err
	}

	server.startHTTPServer()
	return nil
}
