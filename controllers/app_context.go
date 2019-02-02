package controllers

import (
	"github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

// AppContext holds the context for each request
// Everything in context must be thread-safe
type AppContext struct {
	DB      *dynamodb.DynamoDB
	Cognito *cognitoidentityprovider.CognitoIdentityProvider
}
