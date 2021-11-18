package token

import "TKPM/pkg/requestInfo"

type Authenticator interface {
	Generate(payload *requestinfo.Info) (*Token, error)
	Verify(token string) (*Payload, error)
}
