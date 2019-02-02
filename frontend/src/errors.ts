export default {
  AccountValidationError: {
    name: {
      required: 'Name is required',
      alpha: 'Name should contain only letters'
    },
    email: {
      required: 'Email is required',
      email: 'Email address is not valid',
      unique: 'Email address already in use',
      notfound: 'Email address is not registered',
      notconfirmed: 'Email address is not verified',
      notauthorized: 'Invalid email/password'
    },
    password: {
      required: 'Password is required',
      min: 'Password should be atleast 8 characters',
      max: 'Password should not exceed 30 characters',
      incorrect: 'Incorrect password'
    },
    code: {
      required: 'Verification code is required',
      incorrect: 'Incorrect verification code'
    }
  }
};
