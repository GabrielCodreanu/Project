# Frontend

This directory contains the React web application for the platform.

## Files

- `index.html` – Entry point that loads React, React Router, and Babel from CDNs and renders the application.
- `style.css` – Basic black and gold theme used across the pages.
- `src/app.js` – Application code using React Router and a small authentication context.


The app contains multiple pages:

- **Home** – shows a welcome message and available courses when logged in
- **Recommendations** – lists sample course or quiz recommendations
- **Quiz** – allows submitting an answer and displays the auto-graded score
- **Chatbot** – simple assistant demonstrating the chat API
- **Login/Register** – user authentication
- **Profile** – view role and logout
- **Admin** – add new courses

It communicates with the backend API for authentication, course management, recommendations, grading, and chat.

The design uses a black background with gold accents to provide a modern, elegant appearance.
