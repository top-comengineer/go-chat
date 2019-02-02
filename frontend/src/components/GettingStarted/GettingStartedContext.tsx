import React from 'react';

const handleChange = (field: string) => e => {
  /**/
};

const login = e => {
  /**/
};

const reset = () => {
  /**/
};

export default React.createContext({
  name: '',
  email: '',
  password: '',
  code: '',
  message: '',
  success: true,
  loading: false,
  handleChange,
  handleBlur: handleChange,
  login,
  verify: login,
  register: login,
  touched: {
    name: false,
    email: false,
    password: false,
    code: false
  },
  errors: {
    name: '',
    email: '',
    password: '',
    code: ''
  },
  reset
});
