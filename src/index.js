/* eslint-disable */
import 'dotenv/config'; // todo how is this handled?
import * as Sentry from '@sentry/node';
import debug from 'debug';

const dlog = debug('that:api:events:index');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // environment: l,
  // release: process.env.SENTRY_VERSION || defaultVersion,
  debug: process.env.NODE_ENV === 'development',
});

Sentry.configureScope(scope => {
  scope.setTag('loyalRooster', 'loyal-rooster-api');
});

addEventListener('fetch', event => {
  try {
    event.respondWith(handleRequest(event.request));
  } catch (e) {
    let logger = new Logger();
    e.waitUntil(logger.logError(ex, e.request));
  }

  event.respondWith(handleRequest(e));
});

async function handleRequest(request) {
  dlog('handleRequest');
  // const correlationId = req.headers['that-correlation-id']
  //   ? req.headers['that-correlation-id']
  //   : uuid();

  // Sentry.configureScope(scope => {
  //   scope.setTag('correlationId', correlationId);
  // });

  return new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain' },
  });
}

/* eslint-enable */
