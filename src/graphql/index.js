import debug from 'debug';
import { ApolloServer, gql } from 'apollo-server-cloudflare';
import serverOptions from './options';

import KVCache from '../utilities/KVCache';
import typeDefsRaw from './typeDefs';
import resolvers from './resolvers';

const {
  graphqlCloudflare,
} = require('apollo-server-cloudflare/dist/cloudflareApollo');

const dlog = debug('unspecified:loyalrooster:api:graph');

const kvCache = { cache: new KVCache() };

const typeDefs = gql`
  ${typeDefsRaw}
`;

const dataSources = () => ({});

const createServer = () => {
  dlog('creating apollo server');

  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    dataSources,
    ...(serverOptions.kvCache ? kvCache : {}),
  });
};

const handler = request => {
  const server = createServer();
  return graphqlCloudflare(() => server.createGraphQLServerOptions(request))(
    request,
  );
};

export default handler;
export const options = serverOptions;
