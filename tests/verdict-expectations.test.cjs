const test = require('node:test');
const assert = require('node:assert/strict');

// Expected Isotope outcomes for the migration mutations. Blocking cases are
// deterministic contract breaks; advisory cases need semantic review.
const cases = [
  ['legacy-chat.ts', 'FAIL', 'legacy API call remains'],
  ['mixed-surfaces.ts', 'FAIL', 'old and new API surfaces coexist'],
  ['wrong-endpoint.ts', 'FAIL', 'provider endpoint changed'],
  ['output-shape-drift.ts', 'FAIL', 'Responses result is read with legacy shape'],
  ['streaming-mismatch.ts', 'ESCALATE', 'streaming semantics require review'],
  ['error-swallowing.ts', 'ESCALATE', 'error policy is behavior-dependent'],
];

test('migration variants have explicit Isotope verdict expectations', () => {
  assert.deepEqual(cases.map(([fixture, verdict]) => ({ fixture, verdict })), [
    { fixture: 'legacy-chat.ts', verdict: 'FAIL' },
    { fixture: 'mixed-surfaces.ts', verdict: 'FAIL' },
    { fixture: 'wrong-endpoint.ts', verdict: 'FAIL' },
    { fixture: 'output-shape-drift.ts', verdict: 'FAIL' },
    { fixture: 'streaming-mismatch.ts', verdict: 'ESCALATE' },
    { fixture: 'error-swallowing.ts', verdict: 'ESCALATE' },
  ]);
});

test('blocking and advisory cases are kept distinct', () => {
  const blocking = cases.filter(([, verdict]) => verdict === 'FAIL');
  const advisory = cases.filter(([, verdict]) => verdict === 'ESCALATE');
  assert.equal(blocking.length, 4);
  assert.equal(advisory.length, 2);
  assert.ok(blocking.every(([, , reason]) => reason.length > 0));
  assert.ok(advisory.every(([, , reason]) => reason.length > 0));
});
