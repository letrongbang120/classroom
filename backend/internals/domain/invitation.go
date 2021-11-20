package domain

// import (
// 	"TKPM/configs"
// 	"TKPM/internals/models"
// 	"TKPM/internals/repository"
// 	"bytes"
// 	"context"
// 	"fmt"
// 	"net/http"

// 	"github.com/aws/aws-sdk-go/aws"
// 	"github.com/aws/aws-sdk-go/aws/credentials"
// 	"github.com/aws/aws-sdk-go/aws/session"
// 	"github.com/aws/aws-sdk-go/service/s3"
// )

// type Class interface {
// 	UploadImage(ctx context.Context, data []byte, name string, size int64, storageConfig configs.Storage) (*string, error)
// 	Create(ctx context.Context, class *models.Class) (*models.Class, error)
// 	Update(ctx context.Context, class *models.Class) (*models.Class, error)
// 	GetClassList(ctx context.Context, offset, limit int64) ([]*models.Class, error)
// 	GetClassById(ctx context.Context, classId string) (*models.Class, error)
// 	GetClassByAccountID(ctx context.Context, accountID string) ([]*models.Class, error)
// }

// type classDomain struct {
// 	classRepository repository.Class
// }

// func NewClassDomain(classRepository repository.Class) Class {
// 	return &classDomain{
// 		classRepository: classRepository,
// 	}
// }

// func (d *classDomain) UploadImage(ctx context.Context, data []byte, fileName string, size int64, storageConfig configs.Storage) (*string, error) {
// 	creds := credentials.NewStaticCredentials(storageConfig.AccessKey, storageConfig.SecretKey, "")
// 	_, err := creds.Get()
// 	if err != nil {
// 		fmt.Printf("Bad credentials: %s", err)
// 		return nil, err
// 	}

// 	cfg := aws.NewConfig().WithRegion(storageConfig.Region).WithCredentials(creds)
// 	ss, err := session.NewSession()
// 	if err != nil {
// 		return nil, err
// 	}

// 	svc := s3.New(ss, cfg)
// 	fileBytes := bytes.NewReader(data)
// 	fileType := http.DetectContentType(data)
// 	path := "/" + fileName
// 	params := &s3.PutObjectInput{
// 		Bucket:        aws.String(storageConfig.BucketName),
// 		Key:           aws.String(path),
// 		Body:          fileBytes,
// 		ContentLength: aws.Int64(size),
// 		ContentType:   aws.String(fileType),
// 	}

// 	_, err = svc.PutObject(params)
// 	if err != nil {
// 		fmt.Printf("can not upload image : %s", err)
// 		return nil, err
// 	}

// 	url := fmt.Sprintf("https://%v.s3.%v.amazonaws.com%v", storageConfig.BucketName, storageConfig.Region, path)

// 	return &url, nil
// }

// func (d *classDomain) Create(ctx context.Context, class *models.Class) (*models.Class, error) {
// 	res, err := d.classRepository.Create(ctx, class)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return res, nil
// }

// func (d *classDomain) Update(ctx context.Context, class *models.Class) (*models.Class, error) {
// 	res, err := d.classRepository.Update(ctx, class)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return res, nil
// }

// func (d *classDomain) GetClassList(ctx context.Context, offset, limit int64) ([]*models.Class, error) {
// 	res, err := d.classRepository.GetClassList(ctx, offset, limit)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return res, nil
// }

// func (d *classDomain) GetClassById(ctx context.Context, ClassId string) (*models.Class, error) {
// 	res, err := d.classRepository.GetClassById(ctx, ClassId)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return res, nil
// }

// func (d *classDomain) GetClassByAccountID(ctx context.Context, accountID string) ([]*models.Class, error) {
// 	res, err := d.classRepository.GetClassByAccountID(ctx, accountID)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return res, nil
// }
