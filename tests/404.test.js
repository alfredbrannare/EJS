import { expect, test } from '@jest/globals';
import request from 'supertest';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import startApp from '../src/js/server/app.js';

test('Non-existent page returns 404 page', async () => {
  const app = startApp(
    {
      fetchMovie: async (id) => {
        if (id === '999') {
          return null;
        }

        return {
          id: 1,
          title: 'Pulp Fiction',
        };
      },
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

  const response = await request(app).get('/movie/999').expect('Content-Type', /html/).expect(404);

  expect(response.text).toMatch("Sorry, this page doesn't exist...");
});
