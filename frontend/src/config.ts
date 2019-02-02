// export const BaseUrl = 'http://localhost:5000';
// export const SocketUrl = 'ws://localhost:5000/ws/connect?token=';
declare var process;
const env = process.env.NODE_ENV;

const config = {
  development: {
    baseUrl:
      'https://vs32rjul4h.execute-api.ap-south-1.amazonaws.com/GoChatTest',
    SocketUrl:
      'wss://21gooh1x39.execute-api.ap-south-1.amazonaws.com/GoChatWebSocketTest'
  },
  production: {
    SocketUrl:
      'wss://21gooh1x39.execute-api.ap-south-1.amazonaws.com/GoChatWebSocketTest',
    baseUrl:
      'https://vs32rjul4h.execute-api.ap-south-1.amazonaws.com/GoChatTest'
  }
};

export const BaseUrl = config[env].baseUrl;

export const SocketUrl = config[env].SocketUrl;
