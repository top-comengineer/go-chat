package main

import (
	"log"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/praveen001/go-chat/models"

	"github.com/aws/aws-lambda-go/events"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/lestrrat-go/jwx/jwk"
)

// Connect will receive the $connect request
// It will handle the authorization also
func Connect(request APIGatewayWebsocketProxyRequest) (interface{}, error) {
	if request.RequestContext.Authorizer == nil {
		return Authorizer(request)
	}

	id := request.RequestContext.Authorizer.(map[string]interface{})["cognito:username"].(string)
	connectionID := request.RequestContext.ConnectionID
	StoreSocket(id, connectionID)

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
	}, nil
}

// StoreSocket will store the id,connectionid map in dynamodb
func StoreSocket(id, connectionID string) error {
	m := models.UserSocket{
		ID:           id,
		ConnectionID: connectionID,
	}

	av, err := dynamodbattribute.MarshalMap(m)
	if err != nil {
		log.Fatalln("Unable to marshal user socket map", err.Error())
	}

	input := &dynamodb.PutItemInput{
		TableName: aws.String("GoChatSockets"),
		Item:      av,
	}

	sess := GetSession()

	db := dynamodb.New(sess)

	_, err = db.PutItem(input)
	if err != nil {
		log.Fatal("INSERT ERROR", err.Error())
	}

	return nil
}

// Authorizer custom api authorizer
func Authorizer(request APIGatewayWebsocketProxyRequest) (events.APIGatewayCustomAuthorizerResponse, error) {
	token := request.QueryStringParameters["token"]

	// Fetch all keys
	jwkSet, err := jwk.Fetch("https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_vvx4f42sK/.well-known/jwks.json")
	if err != nil {
		log.Fatalln("Unable to fetch keys")
	}

	// Verify
	t, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		keys := jwkSet.LookupKeyID(t.Header["kid"].(string))
		return keys[0].Materialize()
	})
	if err != nil || !t.Valid {
		log.Fatalln("Unauthorized")
	}

	claims := t.Claims.(jwt.MapClaims)

	return events.APIGatewayCustomAuthorizerResponse{
		PrincipalID: "me",
		PolicyDocument: events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				events.IAMPolicyStatement{
					Action:   []string{"execute-api:*"},
					Effect:   "Allow",
					Resource: []string{request.MethodArn},
				},
			},
		},
		Context: claims,
	}, nil
}
