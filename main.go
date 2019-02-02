package main

import (
	"log"

	"github.com/praveen001/go-chat/controllers"
	"github.com/praveen001/go-chat/router"

	"github.com/apex/gateway"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

func main() {
	// Create an AWS session
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("ap-south-1"),
	})
	if err != nil {
		log.Fatalln("Unable to create AWS session", err.Error())
	}

	// Create a new dynamodb connection
	db := dynamodb.New(sess)

	// Cognito Session
	cognito := cognitoidentityprovider.New(sess)

	// Create application context
	ctx := &controllers.AppContext{
		DB:      db,
		Cognito: cognito,
	}

	// Start listening
	log.Fatalln(gateway.ListenAndServe(":3000", router.InitRouter(ctx)))
}
