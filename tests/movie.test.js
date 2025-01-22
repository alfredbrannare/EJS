import { expect, test } from '@jest/globals';
import request from 'supertest';
import startApp from '../src/js/server/app.js';

test('Individual movie page shows the correct movie title and navigation links', async () => {
  const app = startApp(
    {
      fetchMovie: async (id) => {
        if (id === '1') {
          return {
            id: 1,
            title: 'Pulp Fiction',
            intro: 'A movie about stuff',
            image: { url: 'https://example.com/pulpfiction.jpg' },
          };
        } else if (id === '2') {
          return {
            id: 2,
            title: 'Fire Walk With Me',
            intro: 'A movie about other stuff',
            image: { url: 'https://example.com/firewalk.jpg' },
          };
        } else if (id === '3') {
          return {
            id: 3,
            title: 'Isle of Dogs',
            intro: 'A movie about dogs',
            image: { url: 'https://example.com/isleofdogs.jpg' },
          };
        }
      },
      fetchAllMovies: async () => [
        { id: 1, title: 'Pulp Fiction' },
        { id: 2, title: 'Fire Walk With Me' },
        { id: 3, title: 'Isle of Dogs' },
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

  const response = await request(app).get('/movie/1').expect('Content-Type', /html/).expect(200);

  expect(response.text).toMatch('Pulp Fiction');
  expect(response.text).toMatch('BILJETTER');
  expect(response.text).toMatch('EVENEMANG');
  expect(response.text).toMatch('FILMER');
});
