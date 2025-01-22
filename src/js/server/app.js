import express from 'express';
import ejs from 'ejs';
import { marked } from 'marked';

function startApp(api, nav) {
  const app = express();

  app.locals.formatMarkdown = (text) => marked(text);
  app.set('view engine', 'ejs');

  app.get('/', async (req, res) => {
    try {
      const linkData = await nav.navLinks();
      const moviesData = await api.fetchAllMovies();

      if (!moviesData || !linkData) {
        console.error('Data is missing or malformed');
        return res.status(500).send('Movies or Links data is missing or malformed');
      }

      res.render('pages/index', { moviesData, ...linkData });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error occurred while fetching data from API or navLinks');
    }
  });

  app.get('/movies', async (req, res) => {
    const linkData = await nav.navLinks();
    const moviesData = await api.fetchAllMovies();
    res.render('pages/allMovies', { moviesData, ...linkData });
  });

  app.get('/movie/:movieId', async (req, res) => {
    const linkData = await nav.navLinks();
    const movieData = await api.fetchMovie(req.params.movieId);
    res.render('pages/movie', { movieData, ...linkData });
  });

  app.use('/static', express.static('./static'));

  app.use((req, res) => {
    const linkData = nav.navLinks();
    res.status(404).render('pages/error', { message: 'Page not found', ...linkData });
  });

  return app;
}

export default startApp;
