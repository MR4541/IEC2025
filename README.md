# IEC 2025

## How to run

1.  Make sure to have `flask` and `flask-cors` installed
    on your system or your virtual environment,
    and then go to the `backend/` directory and run
    ```
    flask run
    ```
    to start the backend server at `localhost:5000`

2.  Then, go to the `frontend/` diectory and run
    ```
    echo 'NEXT_PUBLIC_SERVER_HOST=localhost:5000' > .env
    npm run dev # or `pnpm dev`
    ```
    to serve the Next.js website at `localhost:3000`

3.  Navigate to the website in a browser to see the result.

4.  If you want to geenrate simulated order requests,
    run `python3 orderator/order.py`.

5.  To run `LINE Bot`, first `cd` to `linebot/test/`:
    1.  Locally: use `ngrok http 6000` and then `python3 app.py`, and copy the webhook link to LINE Developers.
    2.  Render: deploy it ([How](https://hackmd.io/@k0217/rJKNMyhDkx)) and copy the webhook link to LINE Developers.
    
## Backend endpoints

*   `/notify`: for test purpose only, send a `POST` request to this endpoint
    to trigger the server to send the received data to the LINE bot.

*   `/finance`: get the income statement.

*   `/stock`: get the history of all ingredients' stock changes.

*   `/shortage`: get a list of ingredients that are currently having a shortage.

*   `/order`: send `POST` requests to this endpoint to make orders.
    The payload of an order is a list of objects in JSON,
    each with two attributes:
    *   `item_id`: the ID of the menu item being ordered.
    *   `quantity`: the requested amount of the item being ordered.

*   `/analyze`: send a `POST` request with an entire chat history to get the LLM response.
    The request JSON's format is as follows:
    *   `stream`: a boolean which tells the server if you want streamed response or not.
    *   `messages`: a list of objects with the follwing attributes:
        *   `role`: either `user` or `assistant`, which are consistent with the OpenAI API.
        *   `content`: the content of the chat message.

## LINE Bot usage
*   Use "$ man IEC2025_bot" to get help.
*   To get AI analysis, send messages that start with "[AI] ". The rest of the message will be used as prompt.
*   Use "$ test" to make the backend send a test notification.
