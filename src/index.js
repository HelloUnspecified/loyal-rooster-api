/* eslint-disable */
// import 'dotenv/config'; // todo how is this handled?
import debug from 'debug';
import graphServer, { options } from './graphql';
import { setHeader } from './utilities/cors';

const dlog = debug('unspecified:loyalrooster:api:index');

addEventListener('fetch', event => {
  dlog('fetch listener');
  try {
    event.respondWith(handleRequest(event.request));
  } catch (e) {
    dlog('error %s', JSON.stringify(e));
    // let logger = new Logger();
    // e.waitUntil(logger.logError(ex, e.request));
  }
});

const handleRequest = async request => {
  dlog('handlerRequest');

  const url = new URL(request.url);

  try {
    if (url.pathname === options.baseEndpoint) {
      const response =
        request.method === 'OPTIONS'
          ? new Response('', { status: 204 })
          : await graphServer(request);

      if (options.cors) {
        setHeader(response, options.cors);
      }

      return response;
    } else if (
      options.playgroundEndpoint &&
      url.pathname === options.playgroundEndpoint
    ) {
      return playground(request, options);
    } else if (options.forwardUnmatchedRequestsToOrigin) {
      return fetch(request);
    } else {
      return new Response('Not found', { status: 404 });
    }
  } catch (err) {
    return new Response(options.debug ? err : 'Something went wrong', {
      status: 500,
    });
  }
};

/* eslint-enable */
