View the live site at https://peacehens.com

To run this project on VS Code, create a project, and install the client and server directories along with all their files and subdirectories.

Get Stripe API keys.

Set up a MongoDB cluster.

In client -> src -> constants -> index.js, set isProduction to false, and set the Stripe keys.

In server -> .env, set values for the variables:
* PORT
* SECRET
* PASSWORD_RESET_SECRET
* REGISTRATION_SECRET
* CHANGE_EMAIL_SECRET
* CLIENT_URL
* SERVER_URL
* MONGO_URL
* DB_NAME
* EMAIL_ADDRESS
* EMAIL_PASSWORD
* APP_PASSWORD
* STRIPE_KEY
