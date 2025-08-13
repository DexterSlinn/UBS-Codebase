# Marcel - UBS AI Guide

A standalone chatbot assistant for UBS, built with React and Vite on the frontend and Express with Groq API on the backend.

## Features

- Modern, UBS-branded user interface
- Real-time chat functionality
- Integration with Groq AI API
- Responsive design

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Groq API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Groq API key:
   ```
   GROQ_API_KEY=your_api_key_here
   PORT=3000
   ```

## Running the Application

### Start the backend server

```
npm run server
```

The server will run on http://localhost:3003

### Start the frontend development server

```
npm run dev
```

The frontend will run on http://localhost:5173 or another port if 5173 is in use.

## Building for Production

```
npm run build
```

This will create a production-ready build in the `dist` directory.

## Project Structure

- `/src` - Frontend React application
  - `/assets` - Static assets like images and SVGs
  - `/components` - React components
- `index.js` - Backend Express server
- `vite.config.js` - Vite configuration

## Technologies Used

- React
- Vite
- Express
- Groq AI API
- TailwindCSS
# UBS-Codebase
