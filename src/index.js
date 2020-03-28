/* eslint-disable */
import 'dotenv/config'; // todo how is this handled?
import debug from 'debug';

const dlog = debug('that:api:events:index');

addEventListener('fetch', event => {
  try {
    event.respondWith(handleRequest(event.request));
  } catch (e) {
    dlog('error %s', JSON.stringify(e));
    // let logger = new Logger();
    // e.waitUntil(logger.logError(ex, e.request));
  }

  // event.respondWith(handleRequest(e));
});

async function handleRequest(request) {
  dlog('handleRequest');

  return new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain' },
  });
}

/* eslint-enable */
