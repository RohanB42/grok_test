const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dir = path.join(__dirname, 'fixtures', 'migrations');
const read = name => fs.readFileSync(path.join(dir, name), 'utf8');

test('legacy Chat Completions usage is detectable', () => {
  assert.match(read('legacy-chat.ts'), /chat\.completions\.create/);
  assert.doesNotMatch(read('legacy-chat.ts'), /responses\.create/);
});

test('mixed legacy and Responses surfaces are detectable', () => {
  const source = read('mixed-surfaces.ts');
  assert.match(source, /chat\.completions\.create/);
  assert.match(source, /responses\.create/);
});

test('wrong provider endpoint is detectable', () => {
  assert.match(read('wrong-endpoint.ts'), /api\.openai\.com\/v1/);
  assert.doesNotMatch(read('wrong-endpoint.ts'), /api\.x\.ai\/v1/);
});

test('Responses output-shape drift is detectable', () => {
  const source = read('output-shape-drift.ts');
  assert.match(source, /responses\.create/);
  assert.match(source, /choices\[0\]\.message\.content/);
  assert.doesNotMatch(source, /output_text/);
});

test('streaming and non-streaming response handling mismatch is detectable', () => {
  const source = read('streaming-mismatch.ts');
  assert.match(source, /stream:\s*true/);
  assert.match(source, /stream\.output_text/);
});

test('error swallowing is detectable', () => {
  const source = read('error-swallowing.ts');
  assert.match(source, /catch/);
  assert.match(source, /status\(200\)/);
});
