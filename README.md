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
- **Movie Recommendations** - Personalized movie suggestions based on user preferences
- **Multi-User Support** - Multiple users can maintain their own collections

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

4. **Seed the database with sample movies:**
   ```bash
   npm run seed
   ```
   This will create sample users (jybhavsar and Ram) with 22 popular movies.

5. **Generate SSL certificates (for HTTPS):**
   ```bash
   chmod +x generate-cert.sh
   ./generate-cert.sh
   ```

6. **Start the application:**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

7. **Open your browser:**
   - HTTP: `http://localhost:3000`
   - HTTPS: `https://localhost:3443`

## Sample Data

The application comes with pre-seeded data including:

### Sample Users
- **jybhavsar** - Original curator with classic films
- **Ram** - Modern movie enthusiast

### Sample Movies (22 total)
**Classic Collection (jybhavsar):**
- The Shawshank Redemption (1994) - 9.3/10
- The Dark Knight (2008) - 9.0/10
- Pulp Fiction (1994) - 8.9/10
- Forrest Gump (1994) - 8.8/10
- Inception (2010) - 8.8/10
- The Matrix (1999) - 8.7/10
- Goodfellas (1990) - 8.7/10
- The Silence of the Lambs (1991) - 8.6/10
- Interstellar (2014) - 8.6/10
- Parasite (2019) - 8.5/10

**Modern Collection (Ram):**
- Avengers: Endgame (2019) - 8.4/10
- Spider-Man: Into the Spider-Verse (2018) - 8.4/10
- Joker (2019) - 8.4/10
- Mad Max: Fury Road (2015) - 8.1/10
- The Grand Budapest Hotel (2014) - 8.1/10
- Blade Runner 2049 (2017) - 8.0/10
- Dune (2021) - 8.0/10
- La La Land (2016) - 8.0/10
- Knives Out (2019) - 7.9/10
- Everything Everywhere All at Once (2022) - 7.8/10
- Get Out (2017) - 7.7/10
- John Wick (2014) - 7.4/10

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
│   │   └── style.css        # Enhanced styling with themes
│   ├── js/
│   │   └── app.js           # Client-side functionality
│   └── images/
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── movies.js            # Movie CRUD routes
│   └── index.js             # Home routes
├── views/
│   ├── auth/                # Login/Register templates
│   ├── movies/              # Movie templates
│   │   ├── index.ejs        # Movie listing with recommendations
│   │   ├── show.ejs         # Movie details
│   │   ├── add.ejs          # Add movie form
│   │   ├── edit.ejs         # Edit movie form
│   │   └── recommendations.ejs # Personalized recommendations
│   └── partials/            # Reusable components
├── ssl/                     # SSL certificates
├── seedMovies.js            # Database seeding script
├── app.js                   # Main application file
├── package.json             # Dependencies and scripts
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
- **Custom CSS** - Enhanced styling with gradients and animations

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
- `GET /movies` - List all movies with recommendations
- `GET /movies/add` - Add movie form
- `POST /movies` - Create new movie
- `GET /movies/:id` - Movie details
- `GET /movies/:id/edit` - Edit movie form
- `PUT /movies/:id` - Update movie
- `DELETE /movies/:id` - Delete movie
- `GET /movies/genre/:genre` - Movies by genre
- `GET /movies/recommendations` - Personalized recommendations

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

## Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample movies and users
npm run https      # Start HTTPS server
npm run build      # No build step required
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

## Features in Detail

### Movie Recommendations
- **Personalized Suggestions** - Based on user's movie preferences and genres
- **Smart Algorithm** - Recommends highly-rated movies from similar genres
- **Cross-User Discovery** - Discover movies added by other users
- **Genre-Based Filtering** - Filter recommendations by preferred genres

### User Experience
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Theme Toggle** - Switch between dark and light themes
- **Smooth Animations** - Enhanced UI with CSS transitions
- **Intuitive Navigation** - Easy-to-use interface with clear visual hierarchy

### Security Features
- **Session Management** - Secure user sessions
- **Input Validation** - Server-side validation for all forms
- **User Authorization** - Users can only edit their own movies
- **HTTPS Support** - SSL encryption for secure connections

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
![answer 2025-12-02 at 11 52 02 AM](https://github.com/user-attachments/assets/cf9de4d1-6326-455c-8cb9-cef798fb8d19)
Beautiful movie grid with responsive cards and ratings

### Movie Details
![answer 2025-12-02 at 11 52 09 AM](https://github.com/user-attachments/assets/25bbdf83-8e63-45b1-bf7f-9541bc049881)
Comprehensive movie information with edit/delete options

### Add/Edit Movie
![answer 2025-12-02 at 11 52 40 AM](https://github.com/user-attachments/assets/564dc67a-0e13-4980-82b5-219eecf37fc0)

User-friendly forms with validation and error handling

### Authentication
![answer 2025-12-02 at 11 52 19 AM](https://github.com/user-attachments/assets/2239b5f5-36cb-4f43-bd1f-1252f4570928)

Secure login and registration system

---

**Star this repository if you found it helpful!**

**Happy Movie Collecting!**
