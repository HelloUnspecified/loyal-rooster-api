import debug from 'debug';
import { ApolloServer, gql } from 'apollo-server-cloudflare';

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
  });
};

export default createServer;
