import { resolvers as graphScalars } from 'graphql-scalars';

import queries, { fieldResolvers as qFieldResolvers } from './queries';
import mutations, { fieldResolvers as mFieldResolvers } from './mutations';

const createServer = {
  ...graphScalars,

  ...qFieldResolvers,
  ...mFieldResolvers,

  Query: {
    ...queries,
  },

  Mutation: {
    ...mutations,
  },
};

export default createServer;
