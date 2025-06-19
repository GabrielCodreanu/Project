# Backend

This directory hosts the Node.js/Express.js server and all backend code. It also includes database access layers for SQL databases such as MySQL or PostgreSQL.

## Running the Server

1. Install dependencies with `npm install`.
2. Start the server using `npm start`.

The default server listens on port `3001` and exposes several JSON endpoints:

- `GET /api/hello` – Test endpoint returning a greeting
- `GET /api/recommendations` – Returns a list of recommended courses or quizzes
- `POST /api/grade` – Accepts answers and returns a mock score
- `POST /api/chat` – Echoes back the chat message

The default server listens on port `3001` and exposes a `/api/hello` endpoint returning a simple JSON message.
