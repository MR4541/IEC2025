# IEC 2025

## How to run

1.  First, go to the `backend/` directory and run
    ```
    flask run
    ```
    to start the backend server at `localhost:5000`

2.  Then, go to the `frontend/` diectory and run
    ```
    echo 'NEXT_PUBLIC_SERVER_HOST' > .env
    npm run dev # or `pnpm dev`
    ```
    to serve the Next.js website at `localhost:3000`

3.  Navigate to the website in a browser to see the result.

4.  If you want to geenrate simulated order requests,
    run `python3 orderator/order.py`.

## Backend endpoints

*   `/finance`: get the income statement.

*   `/stock`: get the history of all ingredients' stock changes.

*   `/shortage`: get a list of ingredients that are currently having a shortage.

*   `/order`: send `POST` requests to this endpoint to make orders.

## Order payload format

The payload of an order is a list of objects in JSON,
each with two attributes:

*   `item_id`: the ID of the menu item being ordered.

*   `quantity`: the requested amount of the item being ordered.

