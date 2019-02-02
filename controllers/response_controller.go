package controllers

import (
	"encoding/json"
	"net/http"
)

// Response ..
type response struct {
	Status int
	Data   *payload
	Writer http.ResponseWriter
}

// payload ..
type payload struct {
	ErrCode string      `json:"errCode"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

func (r *response) send() {
	r.Writer.WriteHeader(r.Status)
	json.NewEncoder(r.Writer).Encode(r.Data)
}

func newResponse(w http.ResponseWriter, status int, errCode string, message string, data interface{}) *response {
	r := &response{
		Status: status,
		Data: &payload{
			ErrCode: errCode,
			Data:    data,
			Message: message,
		},
		Writer: w,
	}

	return r
}
