const path = require('path');
const fs = require('fs');

try {
  // require the runtime swagger spec
  const specs = require('../src/config/swagger');
  const outPath = path.resolve(__dirname, '..', 'openapi.json');
  fs.writeFileSync(outPath, JSON.stringify(specs, null, 2));
  console.log(`openapi.json written to ${outPath}`);
} catch (err) {
  console.error('Failed to generate openapi.json:', err);
  process.exit(1);
}
