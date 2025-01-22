import { fetchAllMovies } from '../src/js/server/fetchMovies.js';
import navLinks from '../src/js/server/navLinks.js';

(async () => {
  try {
    const movies = await fetchAllMovies();
    const links = await navLinks();
    console.log('Movies:', movies);
    console.log('Links:', links);
  } catch (error) {
    console.error('Error:', error);
  }
})();
