package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-ozzo/ozzo-validation/is"

	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"

	"github.com/go-ozzo/ozzo-validation"

	"github.com/praveen001/go-chat/models"

	"github.com/apex/gateway"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
)

// SignUp creates a new user in database
func (c *AppContext) SignUp(w http.ResponseWriter, r *http.Request) {
	u := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		log.Fatalln("SignUp: Unable to decode request body", err.Error())
	}

	errors := u.ValidateForSignUp()
	if len(errors) > 0 {
		newResponse(w, http.StatusBadGateway, "AccountValidationError", "Validation Error", errors).send()
		return
	}

	name := &cognitoidentityprovider.AttributeType{
		Name:  aws.String("name"),
		Value: aws.String(u.Name),
	}

	input := &cognitoidentityprovider.SignUpInput{
		ClientId:       aws.String("52p0gdd36sieehdijak4jp8rl9"),
		Username:       aws.String(u.Email),
		Password:       aws.String(u.Password),
		UserAttributes: []*cognitoidentityprovider.AttributeType{name},
	}

	output, err := c.Cognito.SignUp(input)
	if err != nil {
		switch err := err.(awserr.Error); err.Code() {
		case cognitoidentityprovider.ErrCodeUsernameExistsException:
			newResponse(w, http.StatusBadRequest, "AccountValidationError", "Validation Error", map[string]string{"email": "unique"}).send()

		default:
			newResponse(w, http.StatusInternalServerError, "UnknownError", err.Code()+err.Message(), map[string]string{}).send()
		}
		return
	}
	u.ID = *output.UserSub

	av, _ := dynamodbattribute.MarshalMap(u)
	putInput := &dynamodb.PutItemInput{
		TableName: aws.String("GoChatUsers"),
		Item:      av,
	}
	c.DB.PutItem(putInput)

	newResponse(w, http.StatusOK, "", "Registration successful", map[string]string{}).send()
}

// ConfirmSignUp confirms a cognito user through verification code
func (c *AppContext) ConfirmSignUp(w http.ResponseWriter, r *http.Request) {
	val := r.URL.Query()

	errors := make(map[string]string)
	code := val.Get("code")
	if err := validation.Validate(code, validation.Required.Error("required")); err != nil {
		errors["code"] = err.Error()
	}

	u := &models.User{Email: val.Get("email")}
	if err := u.ValidateEmail(); err != nil {
		errors["email"] = err.Error()
	}

	if len(errors) > 0 {
		newResponse(w, http.StatusBadRequest, "AccountValidationError", "Validation Error", errors).send()
		return
	}

	input := &cognitoidentityprovider.ConfirmSignUpInput{
		ClientId:         aws.String("52p0gdd36sieehdijak4jp8rl9"),
		ConfirmationCode: aws.String(code),
		Username:         aws.String(u.Email),
	}

	if _, err := c.Cognito.ConfirmSignUp(input); err != nil {
		switch err := err.(awserr.Error); err.Code() {
		case cognitoidentityprovider.ErrCodeUserNotFoundException:
			newResponse(w, http.StatusBadRequest, "AccountValidationError", "Validation Error", map[string]string{"email": "notfound"}).send()

		case cognitoidentityprovider.ErrCodeNotAuthorizedException:
			newResponse(w, http.StatusBadRequest, "AccountValidationError", "Validation Error", map[string]string{"code": "incorrect"}).send()

		default:
			newResponse(w, http.StatusInternalServerError, "UnknownError", err.Code(), map[string]string{}).send()
		}
		return
	}

	newResponse(w, http.StatusOK, "", "Verification successful", map[string]string{}).send()
}

// SignIn allows user to sign in using username and password
func (c *AppContext) SignIn(w http.ResponseWriter, r *http.Request) {
	u := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		log.Fatalln("SignUp: Unable to decode request body", err.Error())
	}

	errors := u.ValidateForSignIn()
	if len(errors) > 0 {
		newResponse(w, http.StatusBadGateway, "AccountValidationError", "Validation Error", errors).send()
		return
	}

	input := &cognitoidentityprovider.InitiateAuthInput{
		ClientId: aws.String("52p0gdd36sieehdijak4jp8rl9"),
		AuthFlow: aws.String(cognitoidentityprovider.AuthFlowTypeUserPasswordAuth),
		AuthParameters: map[string]*string{
			"USERNAME": aws.String(u.Email),
			"PASSWORD": aws.String(u.Password),
		},
	}

	output, err := c.Cognito.InitiateAuth(input)
	if err != nil {
		switch err := err.(awserr.Error); err.Code() {
		case cognitoidentityprovider.ErrCodeUserNotFoundException:
			newResponse(w, http.StatusBadRequest, "AccountValidationError", "Validation Error", map[string]string{"email": "notfound"}).send()

		case cognitoidentityprovider.ErrCodeUserNotConfirmedException:
			newResponse(w, http.StatusBadRequest, "AccountValidationError", "Validation Error", map[string]string{"email": "notconfirmed"}).send()

		case cognitoidentityprovider.ErrCodeNotAuthorizedException:
			newResponse(w, http.StatusBadRequest, "AccountValidationError", "Validation Error", map[string]string{"email": "notauthorized"}).send()

		default:
			newResponse(w, http.StatusInternalServerError, "UnknownError", err.Code(), map[string]string{}).send()
		}
		return
	}

	newResponse(w, http.StatusOK, "Sign in successful", "", map[string]interface{}{
		"idToken":      *output.AuthenticationResult.IdToken,
		"accessToken":  *output.AuthenticationResult.AccessToken,
		"refreshToken": *output.AuthenticationResult.RefreshToken,
		"expiry":       *output.AuthenticationResult.ExpiresIn,
	}).send()
}

// TokenInfo gives details about the logged in user
func (c *AppContext) TokenInfo(w http.ResponseWriter, r *http.Request) {
	ctx, _ := gateway.RequestContext(r.Context())

	newResponse(w, http.StatusOK, "Sign in successful", "", ctx.Authorizer["claims"]).send()
}

// FindUser finds user by email
func (c *AppContext) FindUser(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	email := query.Get("email")
	log.Println("Valid", email)
	if err := validation.Validate(email, validation.Required.Error("Email is required"), is.Email.Error("Invalid email")); err != nil {
		newResponse(w, http.StatusBadRequest, "FindUserInvalidEmail", "Email address is not valid", []map[string]string{}).send()
		return
	}

	input := &dynamodb.QueryInput{
		TableName: aws.String("GoChatUsers"),
		IndexName: aws.String("email-index"),
		ExpressionAttributeNames: map[string]*string{
			"#E": aws.String("email"),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":email": &dynamodb.AttributeValue{
				S: aws.String(email),
			},
		},
		KeyConditionExpression: aws.String("#E = :email"),
	}

	output, err := c.DB.Query(input)
	if err != nil {
		log.Println("QueryFailed", err.Error())
		newResponse(w, http.StatusInternalServerError, "FindUserNotFound", "User not found", []map[string]string{}).send()
		return
	}

	if *output.Count == 0 {
		newResponse(w, http.StatusOK, "FindUserNotFound", "User not found", []map[string]string{}).send()
		return
	}

	u := make([]interface{}, *output.Count)
	dynamodbattribute.UnmarshalListOfMaps(output.Items, &u)

	newResponse(w, http.StatusOK, "FindUserFound", "Found user", u).send()
}

// SendRequest send friend request to user
// func (c *AppContext) SendRequest(w http.ResponseWriter, r *http.Request) {
// 	ctx, _ := gateway.RequestContext(r.Context())
// 	query := r.URL.Query()

// 	id := query.Get("id")

// 	// Get the other user
// 	input := &dynamodb.GetItemInput{
// 		TableName: aws.String("GoChatUsers"),
// 		Key: map[string]*dynamodb.AttributeValue{
// 			"id": &dynamodb.AttributeValue{
// 				S: aws.String(id),
// 			},
// 		},
// 	}

// 	output, err := c.DB.GetItem(input)
// 	if err != nil {
// 		newResponse(w, http.StatusBadRequest, "SendRequestUserNotFound", "User not found", nil).send()
// 		return
// 	}

// 	user := models.User{}
// 	if err := dynamodbattribute.UnmarshalMap(output.Item, &user); err != nil {
// 		return
// 	}

// 	// Check if blocked
// 	sender := ctx.Authorizer["claims"].(map[string]interface{})["cognito:username"].(string)
// 	if blocked := user.HasBlocked(sender); blocked {
// 		newResponse(w, http.StatusBadRequest, "SendRequestBlocked", "User has blocked you", nil).send()
// 		return
// 	}

// 	// Check is request exists already
// 	if hasRequest, incoming := user.HasRequestFrom(sender); hasRequest {
// 		if incoming {
// 			newResponse(w, http.StatusBadRequest, "SendRequestRequestExist", "Request Exists already", nil).send()
// 			return
// 		}
// 		newResponse(w, http.StatusBadRequest, "SendRequestRequestPending", "Request pending", nil).send()
// 		return
// 	}

// 	// Check is user is already a friend
// 	if isFriend := user.IsFriend(sender); isFriend {
// 		newResponse(w, http.StatusBadRequest, "SendRequestAlreadyFriend", "Already friends", nil).send()
// 		return
// 	}

// 	// Add a request
// 	uInput := &dynamodb.UpdateItemInput{
// 		TableName: aws.String("GoChatUsers"),
// 		Key: map[string]*dynamodb.AttributeValue{
// 			"id": &dynamodb.AttributeValue{
// 				S: aws.String(id),
// 			},
// 		},
// 		ExpressionAttributeNames: map[string]*string{
// 			"#sender": aws.String(sender),
// 		},
// 		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
// 			":req": &dynamodb.AttributeValue{
// 				BOOL: aws.Bool(true),
// 			},
// 		},
// 		UpdateExpression: aws.String("SET requests.#sender = :req"),
// 	}
// 	c.DB.UpdateItem(uInput)

// 	uInput = &dynamodb.UpdateItemInput{
// 		TableName: aws.String("GoChatUsers"),
// 		Key: map[string]*dynamodb.AttributeValue{
// 			"id": &dynamodb.AttributeValue{
// 				S: aws.String(sender),
// 			},
// 		},
// 		ExpressionAttributeNames: map[string]*string{
// 			"#sender": aws.String(id),
// 		},
// 		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
// 			":req": &dynamodb.AttributeValue{
// 				BOOL: aws.Bool(false),
// 			},
// 		},
// 		UpdateExpression: aws.String("SET requests.#sender = :req"),
// 	}
// 	c.DB.UpdateItem(uInput)

// 	newResponse(w, http.StatusOK, "SendRequestSent", "Request sent", nil).send()
// }

// AcceptRequest accept a request
// func (c *AppContext) AcceptRequest(w http.ResponseWriter, r *http.Request) {
// 	ctx, _ := gateway.RequestContext(r.Context())
// 	userID := ctx.Authorizer["claims"].(map[string]interface{})["cognito:username"].(string)
// 	query := r.URL.Query()

// 	friendID := query.Get("id")

// 	friend, err := c.getUserByID(friendID)
// 	if err != nil {
// 		newResponse(w, http.StatusBadRequest, "AcceptRequestUserNotFound", "User not found", nil).send()
// 		return
// 	}

// 	// Check if incoming friend request exists
// 	if hasRequest, incoming := friend.HasRequestFrom(userID); !hasRequest || !incoming {
// 		newResponse(w, http.StatusBadRequest, "AcceptRequestRequestDoesNotExist", "No pending request found", nil).send()
// 		return
// 	}

// 	// Check if blocked
// 	if blocked := friend.HasBlocked(userID); blocked {
// 		newResponse(w, http.StatusBadRequest, "AcceptRequestBlocked", "Blocked", nil).send()
// 		return
// 	}

// 	// Remove request and add contact
// 	uInput := &dynamodb.UpdateItemInput{
// 		TableName: aws.String("GoChatUsers"),
// 		Key: map[string]*dynamodb.AttributeValue{
// 			"id": &dynamodb.AttributeValue{
// 				S: aws.String(friendID),
// 			},
// 		},
// 		ExpressionAttributeNames: map[string]*string{
// 			"#sender":   aws.String(userID),
// 			"#contacts": aws.String("contacts"),
// 		},
// 		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
// 			":userID": &dynamodb.AttributeValue{
// 				L: []*dynamodb.AttributeValue{
// 					&dynamodb.AttributeValue{
// 						S: aws.String(userID),
// 					},
// 				},
// 			},
// 		},
// 		UpdateExpression: aws.String("REMOVE requests.#sender SET #contacts = list_append(#contacts, :userID)"),
// 	}
// 	c.DB.UpdateItem(uInput)

// 	uInput = &dynamodb.UpdateItemInput{
// 		TableName: aws.String("GoChatUsers"),
// 		Key: map[string]*dynamodb.AttributeValue{
// 			"id": &dynamodb.AttributeValue{
// 				S: aws.String(userID),
// 			},
// 		},
// 		ExpressionAttributeNames: map[string]*string{
// 			"#friend":   aws.String(friendID),
// 			"#contacts": aws.String("contacts"),
// 		},
// 		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
// 			":userID": &dynamodb.AttributeValue{
// 				L: []*dynamodb.AttributeValue{
// 					&dynamodb.AttributeValue{
// 						S: aws.String(friendID),
// 					},
// 				},
// 			},
// 		},
// 		UpdateExpression: aws.String("REMOVE requests.#friend SET #contacts = list_append(#contacts, :userID)"),
// 	}
// 	c.DB.UpdateItem(uInput)

// 	newResponse(w, http.StatusOK, "AcceptRequestOk", "Accepted request successfully", nil).send()
// }

// GetContacts get user contacts
func (c *AppContext) GetContacts(w http.ResponseWriter, r *http.Request) {
	ctx, _ := gateway.RequestContext(r.Context())
	userID := ctx.Authorizer["claims"].(map[string]interface{})["cognito:username"].(string)

	u, err := c.getUserByID(userID)
	if err != nil {
		log.Println("Unable to fetch users", err.Error())
		newResponse(w, http.StatusBadRequest, "GetContactsInvalidUser", "Invalid user id", map[string]string{"error": err.Error()}).send()
		return
	}

	details, _ := c.getUserContactDetails(u)
	res := map[string]interface{}{
		"user":           u,
		"contactDetails": details,
	}

	newResponse(w, http.StatusOK, "GetContactsOk", "Fetched contacts successfully", res).send()
}

func (c *AppContext) getUserByID(ID string) (*models.User, error) {
	// Get the other user
	input := &dynamodb.GetItemInput{
		TableName: aws.String("GoChatUsers"),
		Key: map[string]*dynamodb.AttributeValue{
			"id": &dynamodb.AttributeValue{
				S: aws.String(ID),
			},
		},
	}

	output, err := c.DB.GetItem(input)
	if err != nil {
		return nil, err
	}

	user := &models.User{}
	if err := dynamodbattribute.UnmarshalMap(output.Item, user); err != nil {
		return nil, err
	}

	return user, nil
}

func (c *AppContext) getUserContactDetails(user *models.User) ([]interface{}, error) {
	uniqueUsers := make(map[string]bool)
	for _, id := range user.Contacts {
		if _, ok := uniqueUsers[id]; !ok {
			uniqueUsers[id] = true
		}
	}

	for k := range user.Requests {
		if _, ok := uniqueUsers[k]; !ok {
			uniqueUsers[k] = true
		}
	}

	for _, id := range user.Blocked {
		if _, ok := uniqueUsers[id]; !ok {
			uniqueUsers[id] = true
		}
	}

	in := &dynamodb.GetItemInput{
		TableName: aws.String("GoChatUsers"),
		ExpressionAttributeNames: map[string]*string{
			"#name": aws.String("name"),
		},
		ProjectionExpression: aws.String("id,email,#name"),
	}

	details := make([]interface{}, len(uniqueUsers))
	i := 0
	for id := range uniqueUsers {
		in.Key = map[string]*dynamodb.AttributeValue{
			"id": &dynamodb.AttributeValue{
				S: aws.String(id),
			},
		}

		out, err := c.DB.GetItem(in)
		if err != nil {
			return nil, err
		}
		var u interface{}
		dynamodbattribute.UnmarshalMap(out.Item, &u)
		details[i] = u
		i++
	}

	return details, nil
}

// AddToContact ..
func (c *AppContext) AddToContact(w http.ResponseWriter, r *http.Request) {
	ctx, _ := gateway.RequestContext(r.Context())
	query := r.URL.Query()

	newContactID := query.Get("id")

	// Get the other user
	input := &dynamodb.GetItemInput{
		TableName: aws.String("GoChatUsers"),
		Key: map[string]*dynamodb.AttributeValue{
			"id": &dynamodb.AttributeValue{
				S: aws.String(newContactID),
			},
		},
	}

	output, err := c.DB.GetItem(input)
	if err != nil {
		newResponse(w, http.StatusBadRequest, "SendRequestUserNotFound", "User not found", nil).send()
		return
	}

	user := models.User{}
	if err := dynamodbattribute.UnmarshalMap(output.Item, &user); err != nil {
		return
	}

	sender := ctx.Authorizer["claims"].(map[string]interface{})["cognito:username"].(string)
	// Check is user is already a friend
	if isFriend := user.IsFriend(sender); isFriend {
		newResponse(w, http.StatusBadRequest, "SendRequestAlreadyFriend", "Already friends", nil).send()
		return
	}

	// Add a request
	uInput := &dynamodb.UpdateItemInput{
		TableName: aws.String("GoChatUsers"),
		Key: map[string]*dynamodb.AttributeValue{
			"id": &dynamodb.AttributeValue{
				S: aws.String(newContactID),
			},
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":sender": &dynamodb.AttributeValue{
				L: []*dynamodb.AttributeValue{
					&dynamodb.AttributeValue{
						S: aws.String(sender),
					},
				},
			},
		},
		UpdateExpression: aws.String("SET contacts = list_append(contacts, :sender)"),
	}
	c.DB.UpdateItem(uInput)

	uInput = &dynamodb.UpdateItemInput{
		TableName: aws.String("GoChatUsers"),
		Key: map[string]*dynamodb.AttributeValue{
			"id": &dynamodb.AttributeValue{
				S: aws.String(sender),
			},
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":id": &dynamodb.AttributeValue{
				L: []*dynamodb.AttributeValue{
					&dynamodb.AttributeValue{
						S: aws.String(newContactID),
					},
				},
			},
		},
		UpdateExpression: aws.String("SET contacts = list_append(contacts, :id)"),
	}
	c.DB.UpdateItem(uInput)

	newResponse(w, http.StatusOK, "SendRequestSent", "Request sent", nil).send()
}
