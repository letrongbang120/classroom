package delivery

import (
	"TKPM/common/enums"
	"TKPM/internals/domain"
	"TKPM/internals/models"
	"TKPM/pkg/token"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

// NewHTTPHandler ...
func NewHTTPHandler(
	classDelivery ClassDelivery,
	accountDelivery AccountDelivery,
	invitationDelivery InvitationDelivery,
	gradeDelivery GradeDelivery,
	reviewDelivery ReviewDelivery,
	authenticator token.Authenticator,
	accountDomain domain.Account,
	classDomain domain.Class) http.Handler {

	router := mux.NewRouter()
	// admin
	router.HandleFunc("/api/v1/accounts/admin", Adapt(http.HandlerFunc(accountDelivery.GetAdminAccountList),
		CheckSuperAdmin(authenticator, accountDomain)).ServeHTTP).Methods("GET")

	router.HandleFunc("/api/v1/sign-up/admin", Adapt(http.HandlerFunc(accountDelivery.SignUpAdmin),
		CheckSuperAdmin(authenticator, accountDomain)).ServeHTTP).Methods("POST")

	// account
	router.HandleFunc("/api/v1/accounts", accountDelivery.GetAccountList).Methods("GET")

	router.HandleFunc("/api/v1/sign-up", accountDelivery.SignUp).Methods("POST")

	router.HandleFunc("/api/v1/sign-in", accountDelivery.SignIn).Methods("POST")

	router.HandleFunc("/api/v1/sign-in/token", accountDelivery.SignInByToken).Methods("POST")

	router.HandleFunc("/api/v1/account", accountDelivery.GetAccountById).Methods("GET")

	router.HandleFunc("/api/v1/account", Adapt(http.HandlerFunc(accountDelivery.UpdateInfo),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("PUT")

	// class
	router.HandleFunc("/api/v1/class", Adapt(http.HandlerFunc(classDelivery.Create),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("POST")

	router.HandleFunc("/api/v1/class", Adapt(http.HandlerFunc(classDelivery.Update),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("PUT")

	router.HandleFunc("/api/v1/class/list", Adapt(http.HandlerFunc(classDelivery.GetClassList),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")

	router.HandleFunc("/api/v1/class", Adapt(http.HandlerFunc(classDelivery.GetClassById),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")

	router.HandleFunc("/api/v1/class/me", Adapt(http.HandlerFunc(classDelivery.GetClassByAccountId),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")

	router.HandleFunc("/api/v1/upload", Adapt(http.HandlerFunc(classDelivery.UploadImage),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("POST")

	router.HandleFunc("/api/v1/upload/students/{classId}", Adapt(http.HandlerFunc(classDelivery.UploadStudentList),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("POST")

	// invitation
	router.HandleFunc("/api/v1/invitation", Adapt(http.HandlerFunc(invitationDelivery.GetLink),
		CheckTeacher(authenticator, accountDomain, classDomain)).ServeHTTP).Methods("POST")

	router.HandleFunc("/api/v1/invitation/mail", Adapt(http.HandlerFunc(invitationDelivery.InviteByEmail),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("POST")

	router.HandleFunc("/api/v1/class/join", Adapt(http.HandlerFunc(invitationDelivery.Join),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("POST")

	// assignment
	router.HandleFunc("/api/v1/assignment", Adapt(http.HandlerFunc(gradeDelivery.CreateAssignment),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("POST")
	router.HandleFunc("/api/v1/assignment", Adapt(http.HandlerFunc(gradeDelivery.UpdateAssignment),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("PUT")
	router.HandleFunc("/api/v1/assignment/detail", Adapt(http.HandlerFunc(gradeDelivery.GetAssignmentById),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")
	router.HandleFunc("/api/v1/assignment/list", Adapt(http.HandlerFunc(gradeDelivery.GetAssignmentList),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")
	router.HandleFunc("/api/v1/assignment/classId", Adapt(http.HandlerFunc(gradeDelivery.GetAssignmentByClassId),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")

	// grade
	router.HandleFunc("/api/v1/grade", Adapt(http.HandlerFunc(gradeDelivery.CreateGrade),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("POST")
	router.HandleFunc("/api/v1/grade", Adapt(http.HandlerFunc(gradeDelivery.UpdateGrade),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("PUT")
	router.HandleFunc("/api/v1/grade/detail", Adapt(http.HandlerFunc(gradeDelivery.GetGradeById),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")
	router.HandleFunc("/api/v1/grade/student", Adapt(http.HandlerFunc(gradeDelivery.GetGradeOfStudent),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")
	router.HandleFunc("/api/v1/grade/list", Adapt(http.HandlerFunc(gradeDelivery.GetGradeList),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")
	router.HandleFunc("/api/v1/grade/upload/{assignmentId}", Adapt(http.HandlerFunc(gradeDelivery.UploadGradeList),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("POST")

	// review
	router.HandleFunc("/api/v1/review", Adapt(http.HandlerFunc(reviewDelivery.Create),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("POST")

	router.HandleFunc("/api/v1/review", Adapt(http.HandlerFunc(reviewDelivery.Update),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("PUT")

	router.HandleFunc("/api/v1/review/list", Adapt(http.HandlerFunc(reviewDelivery.GetReviewList),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")

	router.HandleFunc("/api/v1/review", Adapt(http.HandlerFunc(reviewDelivery.GetReviewById),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")

	router.HandleFunc("/api/v1/review/assignment", Adapt(http.HandlerFunc(reviewDelivery.GetReviewByAssignmentId),
		CheckAuth(authenticator, accountDomain)).ServeHTTP).Methods("GET")

	// admin

	// contract
	// _ = router.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
	// route.Handler(
	// gorilla.Middleware(tracer, route.GetHandler()))
	// return nil
	// })

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

			ctx := context.WithValue(req.Context(), "account_id", payload.AccountID)
			next.ServeHTTP(w, req.WithContext(ctx))
		})
	}
}

func CheckSuperAdmin(authenticator token.Authenticator, accountDomain domain.Account) Adapter {
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

			account, err := accountDomain.CheckAuth(context.Background(), payload.AccountID)
			if err != nil {
				responseWithJson(w, http.StatusBadRequest, map[string]interface{}{
					"message": fmt.Errorf("unable to get user by id: %w", err).Error(),
				})
				return
			}

			if account.Role != enums.SuperAdmin.String() {
				responseWithJson(w, http.StatusBadRequest, map[string]interface{}{
					"message": fmt.Errorf("only super admin can access").Error(),
				})
				return
			}

			ctx := context.WithValue(req.Context(), "account_id", payload.AccountID)
			next.ServeHTTP(w, req.WithContext(ctx))
		})
	}
}

func CheckTeacher(authenticator token.Authenticator, accountDomain domain.Account, classDomain domain.Class) Adapter {
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

			account, err := accountDomain.CheckAuth(context.Background(), payload.AccountID)
			if err != nil {
				responseWithJson(w, http.StatusBadRequest, map[string]interface{}{
					"message": fmt.Errorf("unable to get user by id: %w", err).Error(),
				})
				return
			}

			var data models.Class
			if err := json.NewDecoder(req.Body).Decode(&data); err != nil {
				responseWithJson(w, http.StatusBadRequest, map[string]string{"message": "Invalid body"})
				return
			}

			isTeacher, err := classDomain.IsTeacher(context.Background(), account.AccountID, data.ClassID)
			if !isTeacher || err != nil {
				responseWithJson(w, http.StatusBadRequest, map[string]interface{}{
					"message": "only teacher can create link",
				})
				return
			}

			ctx := context.WithValue(req.Context(), "class_id", data.ClassID)
			next.ServeHTTP(w, req.WithContext(ctx))
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
