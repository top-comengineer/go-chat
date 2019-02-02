package models

// UserSocket ..
type UserSocket struct {
	ID           string `json:"id" dynamodb:"id"`
	ConnectionID string `json:"connectionId" dynamodbav:"connectionId"`
}
