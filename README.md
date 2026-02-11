# UniTrade

UniTrade is a college-based e-commerce platform designed to facilitate the buying and selling of goods among students and faculty within a specific institution. It provides a secure, verified environment for users to trade items, manage their listings, and track their transactions.

## Features

- **User Authentication**: Secure sign-in and registration for students and faculty.
- **College Verification**: Users are verified through their college email addresses to ensure a closed community environment.
- **Item Management**:
  - Users can create listings for items they wish to sell.
  - Support for multiple images per item.
  - Items can be marked as sold.
- **Wishlist Functionality**:
  - Users can add items to a wishlist for future reference.
  - Items can be removed from the wishlist.
- **Transaction History**:
  - Users can view a history of items they have bought and sold.
- **Responsive UI**: A modern, glassmorphism-based user interface that works on both desktop and mobile devices.

## Tech Stack

### Frontend
- **React**: UI library for building the user interface.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: Promise-based HTTP client for making API requests.

### Backend
- **Node.js**: JavaScript runtime for the server.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **Cloudinary**: Cloud-based image and video storage and transformation.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Bcrypt.js**: For password hashing.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- A Cloudinary account (for image storage)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd UniTrade
    ```

2.  **Backend Setup**:
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory with the following variables:
    ```env
    PORT=4000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```
    Start the server:
    ```bash
    npm start
    ```

3.  **Frontend Setup**:
    ```bash
    cd client
    npm install
    ```
    Create a `.env` file in the `client` directory with the following variable:
    ```env
    VITE_API_URL=http://localhost:4000/api
    ```
    Start the development server:
    ```bash
    npm run dev
    ```

## Usage

1.  Open your browser and navigate to `http://localhost:5173` (or the port shown by Vite).
2.  **Sign up** for a new account by providing your college email, name, and other details.
3.  **Log in** with your credentials.
4.  Explore the platform to buy, sell, or wishlist items.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.