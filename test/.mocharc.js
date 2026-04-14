module.exports = {
  timeout: 20000,
  require: ['ts-node/register', './test/hooks.ts'],
  spec: ['./test/specs/configErrors.spec.ts', './test/specs/operations/*.spec.ts']
};
