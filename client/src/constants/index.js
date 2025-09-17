const isProduction = true;

export const SERVER_URL = isProduction ? 'https://wiki-web-service.onrender.com' : 'http://localhost:8000';
export const CLIENT_URL = isProduction ? 'https://www.wiki-client.onrender.com' : 'http://localhost:8080';

export const STRIPE_KEY = isProduction ? 'pk_live_51KvnDxQKwyW3kPTW1OaqSCK0O7KO3F6afYI2Dq8bkVJFYMfpiCosl8l8HXMl8bs6Swv6S1EUoQBPfsGmRrt0x2pB00C7zAaB1I' : 'pk_test_51KvnDxQKwyW3kPTWa3Ng76cvf0duAnAtDB237GuVfr1xvlaRowgh7lfvER6e7afKJptiBog7UfnWc1ZUrGl5kvCq00BROAeKp5';