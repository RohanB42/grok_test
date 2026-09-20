const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const handler = fs.readFileSync(path.join(root, 'src/handler.ts'), 'utf8');
const config = JSON.parse(fs.readFileSync(path.join(root, 'isotope.yml'), 'utf8'));

test('uses the xAI OpenAI-compatible endpoint', () => {
  assert.match(handler, /baseURL:\s*['"]https:\/\/api\.x\.ai\/v1['"]/);
});

test('uses the Responses API and does not call legacy Chat Completions', () => {
  assert.match(handler, /client\.responses\.create/);
  assert.doesNotMatch(handler, /chat\.completions\.create/);
});

test('passes the request prompt through and returns output text', () => {
  assert.match(handler, /input:\s*req\.body\.prompt/);
  assert.match(handler, /response\.output_text/);
});

test('Isotope config analyzes the handler and intercepts both API surfaces', () => {
  assert.deepEqual(config.entryPoints, [{
    file: 'src/handler.ts', export: 'handler', kind: 'express_route'
  }]);
  assert.deepEqual(config.mocks[0].intercept, [
    'chat.completions.create', 'responses.create'
  ]);
});

test('verification policy blocks critical and high findings', () => {
  assert.deepEqual(config.failOn, ['critical', 'high']);
  assert.equal(config.repair.mode, 'off');
});
