package router

func userRouter(r *CustomRouter) {
	r.post("/sign-up", r.SignUp)
	r.get("/confirm", r.ConfirmSignUp)
	r.post("/sign-in", r.SignIn)
	r.get("/token-info", r.TokenInfo)
	r.get("/search", r.FindUser)
	// r.get("/send-request", r.SendRequest)
	// r.get("/accept-request", r.AcceptRequest)
	r.get("/add", r.AddToContact)
	r.get("/contacts", r.GetContacts)
}
