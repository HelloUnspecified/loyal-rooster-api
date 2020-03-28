import path from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

const typesArray = fileLoader('./**/*.graphql', {
  recursive: true,
});

export default mergeTypes(typesArray, { all: true });
