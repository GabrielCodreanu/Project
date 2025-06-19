# Educational Platform

This repository hosts an educational platform aimed at web, Android, and iOS devices. It uses a React frontend, a mobile React Native app, and a Node.js/Express backend with a SQL database. AI features include personalized recommendations, automatic grading, and a chatbot assistant.

## Project Structure

- **frontend/** – React app for the user interface
- **backend/** – Node.js/Express.js server and database layer
- **ai/** – AI models and scripts
- **docs/** – Documentation and design resources
- **mobile/** – React Native app for Android and iOS

Running the Demo

1. In the `backend` directory, run `npm install` and `npm start` to launch the API server. The server uses an in-memory SQLite database for demonstration.
2. Open `frontend/index.html` in a browser to load the React app.
3. The UI provides pages for home, login, registration, profile, and an admin dashboard.
4. You can register or log in, view courses, and if logged in as the default admin (`admin@example.com` / `admin`), add new courses.
Running the Demo

1. In the `backend` directory, run `npm install` and `npm start` to launch the API server.
2. Open `frontend/index.html` in a browser to load the React app.
3. The UI allows you to test the greeting, recommendations, grading, and chat features.
