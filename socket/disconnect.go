package main

import (
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

// Disconnect will receive the $disconnect requests
func Disconnect(request APIGatewayWebsocketProxyRequest) (interface{}, error) {
	id := request.RequestContext.Authorizer.(map[string]interface{})["cognito:username"].(string)
	connectionID := request.RequestContext.ConnectionID
	RemoveSocket(id, connectionID)

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
	}, nil
}

// RemoveSocket will remove the id,connectionId socket from dynamodb
func RemoveSocket(id, connectionID string) {
	input := &dynamodb.DeleteItemInput{
		TableName: aws.String("GoChatSockets"),
		Key: map[string]*dynamodb.AttributeValue{
			"connectionId": &dynamodb.AttributeValue{
				S: aws.String(connectionID),
			},
			"id": &dynamodb.AttributeValue{
				S: aws.String(id),
			},
		},
	}

	db := dynamodb.New(GetSession())

	_, err := db.DeleteItem(input)
	if err != nil {
		log.Fatalln("Unable to remove user socket map", err.Error())
	}
}
