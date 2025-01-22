import { expect, test } from '@jest/globals';
import request from 'supertest';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import startApp from '../src/js/server/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Home page shows list of movies and navigation links', async () => {
  const app = startApp(
    {
      fetchMovie: async () => ({
        id: 1,
        title: 'Pulp Fiction',
      }),
      fetchAllMovies: async () => [
        { id: 1, title: 'Pulp Fiction', image: { url: 'https://example.com/pulpfiction.jpg' } },
        { id: 2, title: 'Fire Walk With Me', image: { url: 'https://example.com/firewalk.jpg' } },
        { id: 3, title: 'Isle of Dogs', image: { url: 'https://example.com/isleofdogs.jpg' } },
      ],
    },
    {
      navLinks: async () => ({
        headerData: [
          { label: 'BILJETTER', id: 'biljetter', link: '#' },
          { label: 'EVENEMANG', id: 'evenemang', link: '#' },
          { label: 'FILMER', id: 'filmer', link: 'movies' },
        ],
        footerSection1: [
          { label: 'OM KINO', link: 'about' },
          { label: 'FRÅGOR SVAR', link: '#' },
          { label: 'KONTAKTA OSS', link: '#' },
        ],
        footerSection2: [
          { label: 'PRESS', link: 'press' },
          { label: 'PARTNERS', link: 'partners' },
          { label: 'JOBB', link: 'careers' },
        ],
        footerSection3: [
          { label: 'SOCIALT', link: 'social' },
          { label: 'INSTAGRAM', link: 'instagram' },
          { label: 'FACEBOOK', link: 'facebook' },
        ],
      }),
    }
  );

  const templatePath = path.resolve(__dirname, '../views/pages/index.ejs');
  console.log('Resolved template path:', templatePath);

  const renderedHtml = await ejs.renderFile(templatePath, {
    moviesData: [
      { id: 1, title: 'Pulp Fiction', image: { url: 'https://example.com/pulpfiction.jpg' } },
      { id: 2, title: 'Fire Walk With Me', image: { url: 'https://example.com/firewalk.jpg' } },
      { id: 3, title: 'Isle of Dogs', image: { url: 'https://example.com/isleofdogs.jpg' } },
    ],
    headerData: [
      { label: 'BILJETTER', id: 'biljetter', link: '#' },
      { label: 'EVENEMANG', id: 'evenemang', link: '#' },
      { label: 'FILMER', id: 'filmer', link: 'movies' },
    ],
    footerSection1: [
      { label: 'OM KINO', link: 'about' },
      { label: 'FRÅGOR SVAR', link: '#' },
      { label: 'KONTAKTA OSS', link: '#' },
    ],
    footerSection2: [
      { label: 'PRESS', link: 'press' },
      { label: 'PARTNERS', link: 'partners' },
      { label: 'JOBB', link: 'careers' },
    ],
    footerSection3: [
      { label: 'SOCIALT', link: 'social' },
      { label: 'INSTAGRAM', link: 'instagram' },
      { label: 'FACEBOOK', link: 'facebook' },
    ],
  });

  const response = await request(app).get('/').expect('Content-Type', /html/).expect(200);

  expect(response.text).toContain(renderedHtml);

  expect(response.text).toMatch('Pulp Fiction');
  expect(response.text).toMatch('Fire Walk With Me');
  expect(response.text).toMatch('Isle of Dogs');
  expect(response.text).toMatch('BILJETTER');
  expect(response.text).toMatch('EVENEMANG');
  expect(response.text).toMatch('FILMER');
});
