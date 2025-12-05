# Movie Collection App

A full-stack web application for managing your personal movie collection with user authentication, HTTPS security, and a beautiful responsive interface.

![Movie Collection](https://img.shields.io/badge/Node.js-Express-green)
![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Security](https://img.shields.io/badge/Security-HTTPS-blue)
![Template](https://img.shields.io/badge/Template-EJS-orange)

## Features

- **User Authentication** - Secure login/register system with sessions
- **Movie Management** - Add, edit, delete, and view movies
- **Rating System** - Rate movies from 1-10 stars
- **Responsive Design** - Beautiful UI with Bootstrap 5
- **HTTPS Security** - SSL certificate support for secure connections
- **Mobile Friendly** - Works perfectly on all devices
- **Genre Categories** - Organize movies by genre
- **User Ownership** - Users can only edit their own movies
- **Movie Details** - Detailed view with poster, description, and metadata
- **Dark/Light Theme Toggle** - Switch between elegant dark and red/white light themes

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jybhavsar12/Movie_Collection.git
   cd Movie_Collection
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/movie_collection
   SESSION_SECRET=your-super-secret-key-here
   NODE_ENV=development
   ```

4. **Generate SSL certificates (for HTTPS):**
   ```bash
   chmod +x generate-cert.sh
   ./generate-cert.sh
   ```

5. **Start the application:**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

6. **Open your browser:**
   - HTTP: `http://localhost:3000`
   - HTTPS: `https://localhost:3443`

## Project Structure

```
Movie_Collection/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── Movie.js             # Movie schema
│   └── User.js              # User schema
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── movies.js            # Movie CRUD routes
│   └── index.js             # Home routes
├── views/
│   ├── auth/                # Login/Register templates
│   ├── movies/              # Movie templates
│   └── partials/            # Reusable components
├── ssl/                     # SSL certificates
├── app.js                   # Main application file
├── package.json             # Dependencies
└── README.md               # This file
```

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Express-session** - Session management
- **Express-validator** - Input validation
- **Method-override** - HTTP method override
- **Dotenv** - Environment variables

### Frontend
- **EJS** - Template engine
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **Responsive Design** - Mobile-first approach
- **Theme Toggle** - Dark/Light mode with localStorage persistence

### Security
- **HTTPS/SSL** - Secure connections
- **Session-based Auth** - Secure authentication
- **Input Validation** - Data sanitization
- **CORS Protection** - Cross-origin security

## Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date
}
```

### Movie Model
```javascript
{
  name: String (required),
  description: String (required),
  year: Number (1900-current year),
  rating: Number (1-10),
  director: String,
  genres: [String],
  poster: String (URL),
  addedBy: ObjectId (User reference),
  createdAt: Date
}
```

## API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Login user
- `GET /auth/register` - Register page
- `POST /auth/register` - Register user
- `POST /auth/logout` - Logout user

### Movies
- `GET /movies` - List all movies
- `GET /movies/add` - Add movie form
- `POST /movies` - Create new movie
- `GET /movies/:id` - Movie details
- `GET /movies/:id/edit` - Edit movie form
- `PUT /movies/:id` - Update movie
- `DELETE /movies/:id` - Delete movie

## Configuration

### Environment Variables
```env
# Server Configuration
PORT=3000                    # HTTP port
HTTPS_PORT=3443             # HTTPS port
NODE_ENV=development        # Environment mode

# Database
MONGODB_URI=mongodb://localhost:27017/movie_collection

# Security
SESSION_SECRET=your-secret-key-here

# SSL (for HTTPS)
SSL_KEY_PATH=./ssl/server.key
SSL_CERT_PATH=./ssl/server.crt
```

### SSL Certificate Generation
The app includes a script to generate self-signed certificates:
```bash
./generate-cert.sh
```

## Deployment

### Local Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Production
```bash
npm start    # Standard production start
```



## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request



## Author

**Jyot Bhavsar**
- GitHub: [@Jybhavsar12](https://github.com/Jybhavsar12)
- Repository: [Movie_Collection](https://github.com/Jybhavsar12/Movie_Collection)

## Acknowledgments

- Bootstrap team for the amazing CSS framework
- MongoDB team for the excellent database
- Express.js community for the robust web framework
- Font Awesome for the beautiful icons

## Screenshots

### Home Page
![answer 2025-12-02 at 11 52 02 AM](https://github.com/user-attachments/assets/cf9de4d1-6326-455c-8cb9-cef798fb8d19)
Beautiful movie grid with responsive cards and ratings

### Movie Details
![answer 2025-12-02 at 11 52 09 AM](https://github.com/user-attachments/assets/25bbdf83-8e63-45b1-bf7f-9541bc049881)
Comprehensive movie information with edit/delete options

### Add/Edit Movie
![answer 2025-12-02 at 11 52 40 AM](https://github.com/user-attachments/assets/564dc67a-0e13-4980-82b5-219eecf37fc0)

User-friendly forms with validation and error handling

### Authentication
![answer 2025-12-02 at 11 52 19 AM](https://github.com/user-attachments/assets/2239b5f5-36cb-4f43-bd1f-1252f4570928)

Secure login and registration system

---

**Star this repository if you found it helpful!**

**Happy Movie Collecting!**
