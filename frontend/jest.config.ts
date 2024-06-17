module.exports = {
    preset: 'ts-jest',
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest"
    },
    testEnvironment: 'jsdom', // This is important for components that interact with the DOM
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Adjust according to your path aliases
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'] // Ignore transformations on node_modules, except where overridden
  };
  