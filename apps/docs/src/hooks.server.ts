import type { Handle } from '@sveltejs/kit';
import * as cookie from 'cookie';

import { COOKIE_USER_ID } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
  const cookies = cookie.parse(event.request.headers.get('cookie') || '');
  event.locals.userId = cookies[COOKIE_USER_ID] || crypto.randomUUID();

  const response = await resolve(event);

  if (!cookies[COOKIE_USER_ID]) {
    // if this is the first time the user has visited this app,
    // set a cookie so that we recognise them when they return
    response.headers.set(
      'set-cookie',
      cookie.serialize(COOKIE_USER_ID, event.locals.userId, {
        path: '/',
        httpOnly: true,
      }),
    );
  }

  return response;
};
