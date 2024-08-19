const isProduction = false;

export const SERVER_URL = isProduction ? '' : 'http://localhost:8000';
export const CLIENT_URL = isProduction ? '' : 'http://localhost:8080';