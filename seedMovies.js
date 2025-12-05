const mongoose = require('mongoose');
require('dotenv').config();
const Movie = require('./models/Movie');
const User = require('./models/User');

const sampleMovies = [
  {
    name: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    year: 1994,
    rating: 9.3,
    director: "Frank Darabont",
    genres: ["Drama"]
  },
  {
    name: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    year: 2008,
    rating: 9.0,
    director: "Christopher Nolan",
    genres: ["Action", "Drama", "Thriller"]
  },
  {
    name: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    year: 1994,
    rating: 8.9,
    director: "Quentin Tarantino",
    genres: ["Drama", "Thriller"]
  },
  {
    name: "Forrest Gump",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.",
    year: 1994,
    rating: 8.8,
    director: "Robert Zemeckis",
    genres: ["Drama", "Romance"]
  },
  {
    name: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    year: 2010,
    rating: 8.8,
    director: "Christopher Nolan",
    genres: ["Action", "Sci-Fi", "Thriller"]
  },
  {
    name: "The Matrix",
    description: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality.",
    year: 1999,
    rating: 8.7,
    director: "The Wachowskis",
    genres: ["Action", "Sci-Fi"]
  },
  {
    name: "Goodfellas",
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.",
    year: 1990,
    rating: 8.7,
    director: "Martin Scorsese",
    genres: ["Drama", "Thriller"]
  },
  {
    name: "The Silence of the Lambs",
    description: "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
    year: 1991,
    rating: 8.6,
    director: "Jonathan Demme",
    genres: ["Horror", "Thriller"]
  },
  {
    name: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    year: 2014,
    rating: 8.6,
    director: "Christopher Nolan",
    genres: ["Drama", "Sci-Fi"]
  },
  {
    name: "Parasite",
    description: "A poor family schemes to become employed by a wealthy family and infiltrate their household by posing as unrelated, highly qualified individuals.",
    year: 2019,
    rating: 8.5,
    director: "Bong Joon-ho",
    genres: ["Drama", "Thriller"]
  },
  // New movies added by Ram
  {
    name: "Avengers: Endgame",
    description: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    year: 2019,
    rating: 8.4,
    director: "Anthony Russo, Joe Russo",
    genres: ["Action", "Sci-Fi"]
  },
  {
    name: "Spider-Man: Into the Spider-Verse",
    description: "Teen Miles Morales becomes Spider-Man and must save the multiverse from the villainous Kingpin.",
    year: 2018,
    rating: 8.4,
    director: "Bob Persichetti, Peter Ramsey",
    genres: ["Action", "Comedy"]
  },
  {
    name: "Joker",
    description: "A failed comedian begins his transformation into the criminal mastermind known as the Joker.",
    year: 2019,
    rating: 8.4,
    director: "Todd Phillips",
    genres: ["Drama", "Thriller"]
  },
  {
    name: "Mad Max: Fury Road",
    description: "In a post-apocalyptic wasteland, Max teams up with Furiosa to flee from a tyrannical warlord.",
    year: 2015,
    rating: 8.1,
    director: "George Miller",
    genres: ["Action", "Thriller"]
  },
  {
    name: "Blade Runner 2049",
    description: "A young blade runner discovers a secret that could plunge what's left of society into chaos.",
    year: 2017,
    rating: 8.0,
    director: "Denis Villeneuve",
    genres: ["Sci-Fi", "Drama"]
  },
  {
    name: "The Grand Budapest Hotel",
    description: "The adventures of Gustave H, a legendary concierge at a famous European hotel, and his protégé Zero.",
    year: 2014,
    rating: 8.1,
    director: "Wes Anderson",
    genres: ["Comedy", "Drama"]
  },
  {
    name: "Dune",
    description: "Paul Atreides leads nomadic tribes in a revolt against the galactic emperor and his father's evil nemesis.",
    year: 2021,
    rating: 8.0,
    director: "Denis Villeneuve",
    genres: ["Sci-Fi", "Drama"]
  },
  {
    name: "John Wick",
    description: "An ex-hitman comes out of retirement to track down the gangsters that took everything from him.",
    year: 2014,
    rating: 7.4,
    director: "Chad Stahelski",
    genres: ["Action", "Thriller"]
  },
  {
    name: "La La Land",
    description: "A jazz musician and an aspiring actress meet and fall in love in Los Angeles while pursuing their dreams.",
    year: 2016,
    rating: 8.0,
    director: "Damien Chazelle",
    genres: ["Romance", "Drama"]
  },
  {
    name: "Get Out",
    description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness becomes a nightmare.",
    year: 2017,
    rating: 7.7,
    director: "Jordan Peele",
    genres: ["Horror", "Thriller"]
  },
  {
    name: "Knives Out",
    description: "A detective investigates the death of a patriarch of an eccentric, combative family.",
    year: 2019,
    rating: 7.9,
    director: "Rian Johnson",
    genres: ["Comedy", "Thriller"]
  },
  {
    name: "Everything Everywhere All at Once",
    description: "A Chinese-American woman gets swept up in an insane adventure where she alone can save existence.",
    year: 2022,
    rating: 7.8,
    director: "Daniels",
    genres: ["Action", "Comedy", "Sci-Fi"]
  }
];

async function seedMovies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find or create Ram user
    let ramUser = await User.findOne({ username: 'Ram' });
    if (!ramUser) {
      ramUser = new User({
        username: 'Ram',
        email: 'ram@example.com',
        password: 'password123'
      });
      await ramUser.save();
      console.log('Created Ram user');
    }
    
    // Find or create jybhavsar user for original movies
    let jybhavsarUser = await User.findOne({ username: 'jybhavsar' });
    if (!jybhavsarUser) {
      jybhavsarUser = new User({
        username: 'jybhavsar',
        email: 'jybhavsar@example.com',
        password: 'password123'
      });
      await jybhavsarUser.save();
      console.log('Created jybhavsar user');
    }
    
    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');
    
    // Split movies between users
    const jybhavsarMovies = sampleMovies.slice(0, 10); // First 10 movies for jybhavsar
    const ramMovies = sampleMovies.slice(10); // Remaining movies for Ram
    
    // Add jybhavsar movies
    const jybhavsarMovieData = jybhavsarMovies.map(movie => ({
      ...movie,
      addedBy: jybhavsarUser._id
    }));
    
    // Add Ram movies
    const ramMovieData = ramMovies.map(movie => ({
      ...movie,
      addedBy: ramUser._id
    }));
    
    await Movie.insertMany([...jybhavsarMovieData, ...ramMovieData]);
    console.log(`Added ${jybhavsarMovies.length} movies for jybhavsar`);
    console.log(`Added ${ramMovies.length} movies for Ram`);
    console.log(`Total: ${sampleMovies.length} movies added`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding movies:', error);
    process.exit(1);
  }
}

seedMovies();
