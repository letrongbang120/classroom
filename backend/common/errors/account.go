package errors

import (
	"fmt"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
)

var (
	ErrEmailExisted         = fmt.Errorf("EMAIL_EXISTED")
	ErrEmailNotFound        = fmt.Errorf("EMAIL_NOT_FOUND")
	ErrPasswordIsNotCorrect = fmt.Errorf("PASSWORD_INCORRECT")
	ErrInvalidToken         = fmt.Errorf("TOKEN_INVALID")
	ErrNoPermission         = fmt.Errorf("NO_PERMISSION")

	ErrInvalidKeySize    = grpc.Errorf(codes.InvalidArgument, "Invalid Key size")
	ErrExpiredToken      = grpc.Errorf(codes.DeadlineExceeded, "Expired token")
	ErrCanNotCreateToken = grpc.Errorf(codes.Unknown, "Can not create token")

	ErrCanNotHashPassword = grpc.Errorf(codes.Unknown, "Can not hash password")

	ErrCanNotExtractInfo     = grpc.Errorf(codes.Unknown, "Can not extract info")
	ErrCanNotMappingMetadata = grpc.Errorf(codes.Unknown, "Can not maping metadata")
)
