'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { withinWorkspace } = require('../src');

test('withinWorkspace rejects traversal and symlinks that leave the checkout', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'uizze-workspace-'));
  fs.mkdirSync(path.join(workspace, 'src'));
  fs.writeFileSync(path.join(workspace, 'src', 'A.tsx'), 'export default null;');
  assert.equal(withinWorkspace(workspace, '../outside.tsx'), null);
  assert.equal(withinWorkspace(workspace, '.'), null);
  assert.equal(withinWorkspace(workspace, 'src/A.tsx'), fs.realpathSync(path.join(workspace, 'src', 'A.tsx')));
  fs.symlinkSync(os.tmpdir(), path.join(workspace, 'outside'));
  assert.equal(withinWorkspace(workspace, 'outside/not-owned.tsx'), null);
});
