package delivery

import (
	"TKPM/internals/domain"
	"TKPM/pkg/token"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/opentracing-contrib/go-gorilla/gorilla"
	"github.com/opentracing/opentracing-go"
)

// NewHTTPHandler ...
func NewHTTPHandler(ClassDelivery ClassDelivery, accountDelivery AccountDelivery, authenticator token.Authenticator, accountDomain domain.Account, tracer opentracing.Tracer) http.Handler {
	router := mux.NewRouter()

	// account
	router.HandleFunc("/api/v1/sign-up", accountDelivery.SignUp).Methods("POST")

	router.HandleFunc("/api/v1/sign-in", accountDelivery.SignIn).Methods("POST")

	router.HandleFunc("/api/v1/account", accountDelivery.GetAccountById).Methods("GET")

	// class
	router.HandleFunc("/api/v1/class", http.HandlerFunc(ClassDelivery.Create)).Methods("POST")

	router.HandleFunc("/api/v1/class", Adapt(http.HandlerFunc(ClassDelivery.Update),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("PUT")

	router.HandleFunc("/api/v1/class/list", Adapt(http.HandlerFunc(ClassDelivery.GetClassList),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")

	router.HandleFunc("/api/v1/class", Adapt(http.HandlerFunc(ClassDelivery.GetClassById),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")

	router.HandleFunc("/api/v1/upload", Adapt(http.HandlerFunc(ClassDelivery.UploadImage),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("POST")

	// contract
	_ = router.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		route.Handler(
			gorilla.Middleware(tracer, route.GetHandler()))
		return nil
	})

	// subRouter.Use(mux.MiddlewareFunc(CheckAuth(authenicator,accountDomain)))

	return router
}

type Adapter func(http.Handler) http.Handler

func Adapt(handler http.Handler, adapters ...Adapter) http.Handler {
	for i := len(adapters); i > 0; i-- {
		handler = adapters[i-1](handler)
	}
	return handler
}

func AllowCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			if r.Method == "OPTIONS" && r.Header.Get("Access-Control-Request-Method") != "" {
				preflightHandler(w, r)
				return
			}
		}
		h.ServeHTTP(w, r)
	})
}

// preflightHandler adds the necessary headers in order to serve
// CORS from any origin using the methods "GET", "HEAD", "POST", "PUT", "DELETE"
// We insist, don't do this without consideration in production systems.
func preflightHandler(w http.ResponseWriter, r *http.Request) {
	headers := []string{"Content-Type", "Accept", "Authorization"}
	w.Header().Set("Access-Control-Allow-Headers", strings.Join(headers, ","))
	methods := []string{"GET", "HEAD", "POST", "PUT", "DELETE"}
	w.Header().Set("Access-Control-Allow-Methods", strings.Join(methods, ","))
}

func responseWithJson(writer http.ResponseWriter, status int, object interface{}) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(status)
	json.NewEncoder(writer).Encode(object)
}

func CheckAuth(authenticator token.Authenticator, accountDomain domain.Account) Adapter {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			token := req.Header.Get("Authorization")
			payload, err := authenticator.Verify(token)
			if err != nil {
				responseWithJson(w, http.StatusBadRequest, map[string]interface{}{
					"message": fmt.Errorf("unable to verify token: %w", err).Error(),
				})
				return
			}

			if _, err := accountDomain.CheckAuth(context.Background(), payload.AccountID); err != nil {
				responseWithJson(w, http.StatusBadRequest, map[string]interface{}{
					"message": fmt.Errorf("unable to get user by id: %w", err).Error(),
				})
				return
			}

			next.ServeHTTP(w, req)
		})
	}
}

func Tracing() Adapter {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			// tracer := opentracing.GlobalTracer()
			// spanCtx, _ := tracer.Extract(opentracing.HTTPHeaders, opentracing.HTTPHeadersCarrier(req.Header))
			// serverSpan := tracer.StartSpan("hotel root", ext.RPCServerOption(spanCtx))
			// defer serverSpan.Finish()
			next.ServeHTTP(w, req)
		})
	}

}
