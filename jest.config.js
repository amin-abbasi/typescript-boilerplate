module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: [
    "**/__tests__/**/*.test.(ts|js)"
  ],
  testEnvironment: "node"
}