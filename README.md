# Using Postman Collection and Environment

This guide provides instructions for using the provided Postman collection and environment to interact with the Forum API.

## Importing Postman Collection

1. Open Postman.
2. Click on **Import** in the top left corner.
3. Select **File** and choose `Forum API V1 Test.postman_collection.json`.
4. Click **Import** to add the collection.

## Importing Postman Environment

1. Open Postman.
2. Click on the **Environments** tab.
3. Click **Import**.
4. Select `Forum API V1 Test.postman_environment.json`.
5. Click **Import** to add the environment.

## Configuring the Environment

1. Go to **Environments** in Postman.
2. Select the imported `Forum API V1 Test` environment.
3. Ensure the following variables are set correctly:
    - `BASE_URL`: `http://localhost:5000`
    - `ACCESS_TOKEN`: *(Leave empty, will be updated after authentication)*
4. Click **Save**.

## Authenticating and Setting Token

1. Open the imported collection.
2. Find the **Login** request.
3. Enter valid credentials and send the request.
4. Copy the `accessToken` from the response.
5. Go to **Environments**, paste the token into `ACCESS_TOKEN`, and **Save**.

## Running API Requests

1. Ensure the correct environment (`Forum API V1 Test`) is selected in Postman.
2. Use the imported collection to send requests to the API.
3. Check responses to verify API functionality.

---
By following these steps, you can efficiently test and interact with the Forum API using Postman.

