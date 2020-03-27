import debug from 'debug';
import { ApolloServer, gql } from 'apollo-server-cloudflare';

import * as Sentry from '@sentry/node';

import typeDefsRaw from './typeDefs';
import resolvers from './resolvers';

const dlog = debug('loyal:rooster:api:graphServer');

const typeDefs = gql`
  ${typeDefsRaw}
`;

const createServer = () => {
  dlog('creating apollo server');

  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: JSON.parse(process.env.ENABLE_GRAPH_INTROSPECTION || false),
    playground: JSON.parse(process.env.ENABLE_GRAPH_PLAYGROUND)
      ? { endpoint: '/' }
      : false,

    formatError: err => {
      dlog('formatError %O', err);

      Sentry.withScope(scope => {
        scope.setTag('formatError', true);
        scope.setLevel('warning');

        scope.setExtra('originalError', err.originalError);
        scope.setExtra('path', err.path);

        Sentry.captureException(err);
      });

      return err;
    },
  });
};

export default createServer;
