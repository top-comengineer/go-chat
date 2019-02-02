package main

import (
	"encoding/json"
	"log"
	"strings"

	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/praveen001/go-chat/models"

	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/apigatewaymanagementapi"
)

// MessageAction ..
/*
{
	type: "",
	payload: {
		to: "",
		from: "",
		"message": ""
	}
}
*/
type MessageAction struct {
	Type    string         `json:"type"`
	Payload MessagePayload `json:"payload"`
}

// MessagePayload ..
type MessagePayload struct {
	Message MessageWithInfo `json:"message"`
}

// MessageWithInfo ..
type MessageWithInfo struct {
	To      string      `json:"to"`
	From    string      `json:"from"`
	Message interface{} `json:"message"`
}

// Default ..
func Default(request APIGatewayWebsocketProxyRequest) (interface{}, error) {
	log.Println(request.Body)
	b := MessageAction{}
	log.Println(b, b.Payload, b.Payload.Message)
	if err := json.NewDecoder(strings.NewReader(request.Body)).Decode(&b); err != nil {
		log.Println("Unable to decode body", err.Error())
	}
	data, _ := json.Marshal(b)

	sess := GetSession()
	db := dynamodb.New(sess)

	queryInput := &dynamodb.QueryInput{
		TableName: aws.String("GoChatSockets"),
		ExpressionAttributeNames: map[string]*string{
			"#id": aws.String("id"),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":id": &dynamodb.AttributeValue{
				S: aws.String(b.Payload.Message.To),
			},
		},
		KeyConditionExpression: aws.String("#id=:id"),
	}

	output, err := db.Query(queryInput)
	if err != nil {
		log.Println("Unable to find connection ID", err.Error())
		return nil, err
	}

	userSocks := make([]models.UserSocket, *output.Count)
	dynamodbattribute.UnmarshalListOfMaps(output.Items, &userSocks)

	for _, userSock := range userSocks {
		input := &apigatewaymanagementapi.PostToConnectionInput{
			ConnectionId: aws.String(userSock.ConnectionID),
			Data:         data,
		}

		apigateway := apigatewaymanagementapi.New(sess, aws.NewConfig().WithEndpoint("21gooh1x39.execute-api.ap-south-1.amazonaws.com/GoChatWebSocketTest"))

		_, err = apigateway.PostToConnection(input)
		if err != nil {
			log.Println("ERROR", err.Error())
		}
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
	}, nil
}
