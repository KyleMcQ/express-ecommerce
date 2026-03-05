# Express E-Commerce Store

A modern, responsive e-commerce application built with Express, Node.js, Mongoose, and Pug.

## Features

- **Product Catalog**: Browse products with categories and details.
- **Shopping Cart**: Add items, update quantities, and remove items from a persistent session-based cart.
- **RESTful API**: A separate backend API for managing products and database interactions.
- **Responsive UI**: Built with Bootstrap 5 for a mobile-friendly experience.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally on default port 27017, or a remote connection string)

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd express-ecommerce
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and configure the variables as shown in `.env.example`:
    ```env
    SESSION_SECRET=your_random_secret
    MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
    ```

## Running the Application

This project consists of two parts: the **Backend API** and the **Frontend Server**.

### 1. Start the Backend API
The backend handles database interactions and serves the product data.
```bash
npm run backend
```
By default, it runs on [http://localhost:3001](http://localhost:3001).

### 2. (Optional) Seed Sample Data
If your database is empty, you can seed it with sample products:
```bash
# Ensure the backend is running first!
node backend/create-sample-data.js
```

### 3. Start the Frontend Server
The frontend serves the web pages and communicates with the backend API.
```bash
npm run frontend
```
The store will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `app.js`: Main frontend server file.
- `backend/`:
    - `backend.js`: API server entry point.
    - `models/`: Mongoose schemas.
    - `routes/`: API route definitions.
- `views/`: Pug templates for the frontend.
- `public/`: Static assets (CSS, JS).
- `package.json`: Project dependencies and scripts.

## Scripts

- `npm run frontend`: Starts the frontend using `nodemon`.
- `npm run backend`: Starts the backend API using `nodemon`.
- `npm test`: Runs the test suite.
