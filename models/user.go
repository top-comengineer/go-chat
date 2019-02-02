package models

import (
	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
)

// User ..
type User struct {
	ID       string          `json:"id" dynamodbav:"id"`
	Name     string          `json:"name" dynamodbav:"name"`
	Email    string          `json:"email" dynamodbav:"email"`
	Password string          `json:"password" dynamodbav:"-"`
	Contacts []string        `json:"contacts" dynamodbav:"contacts"`
	Requests map[string]bool `json:"requests" dynamodbav:"requests"`
	Blocked  []string        `json:"blocked" dynamodbav:"blocked"`
}

// ValidateName validates name field
func (u *User) ValidateName() error {
	return validation.Validate(u.Name, validation.Required.Error("required"), is.Alpha.Error("alpha"))
}

// ValidateEmail validates email field
func (u *User) ValidateEmail() error {
	return validation.Validate(u.Email, validation.Required.Error("required"), is.Email.Error("email"))
}

// ValidatePassword validates password field
func (u *User) ValidatePassword() error {
	return validation.Validate(u.Password, validation.Required.Error("required"), validation.Length(8, 0).Error("min"), validation.Length(8, 30).Error("max"))
}

// ValidateForSignUp checks data required for signing up
func (u *User) ValidateForSignUp() map[string]string {
	errors := map[string]string{}
	if err := u.ValidateName(); err != nil {
		errors["name"] = err.Error()
	}

	if err := u.ValidateEmail(); err != nil {
		errors["email"] = err.Error()
	}

	if err := u.ValidatePassword(); err != nil {
		errors["password"] = err.Error()
	}

	return errors
}

// ValidateForSignIn checks data required for signing in
func (u *User) ValidateForSignIn() map[string]string {
	errors := map[string]string{}
	if err := u.ValidateEmail(); err != nil {
		errors["email"] = err.Error()
	}

	if err := u.ValidatePassword(); err != nil {
		errors["password"] = err.Error()
	}

	return errors
}

// HasRequestFrom ..
func (u *User) HasRequestFrom(ID string) (hasRequest bool, incoming bool) {
	if incoming, ok := u.Requests[ID]; ok {
		if incoming {
			return true, true
		}
		return true, false
	}
	return false, false
}

// HasBlocked ..
func (u *User) HasBlocked(ID string) bool {
	for _, blocked := range u.Blocked {
		if ID == blocked {
			return true
		}
	}
	return false
}

func (u *User) IsFriend(ID string) bool {
	for _, friendID := range u.Contacts {
		if ID == friendID {
			return true
		}
	}
	return false
}
