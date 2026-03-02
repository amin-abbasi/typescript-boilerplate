module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      isolatedModules: true
    }
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest'
  },
  transformIgnorePatterns: ['node_modules/(?!(mongoose-unique-validator)/)'],
  moduleNameMapper: {
    '^mongoose-unique-validator$': '<rootDir>/__mocks__/mongoose-unique-validator.js'
  },
  testMatch: ['**/__tests__/**/*.test.(ts|js)'],
  testEnvironment: 'node'
}
