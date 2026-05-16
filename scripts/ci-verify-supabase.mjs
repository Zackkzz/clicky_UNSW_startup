import fs from 'node:fs';
import path from 'node:path';

const configPath = path.join('supabase', 'config.toml');
if (!fs.existsSync(configPath)) {
  console.error('Missing supabase/config.toml');
  process.exit(1);
}

const migrationsDir = path.join('supabase', 'migrations');
const migrations = fs.readdirSync(migrationsDir).filter((name) => name.endsWith('.sql'));

if (migrations.length < 1) {
  console.error('Expected at least one SQL migration in supabase/migrations/');
  process.exit(1);
}

console.log(`OK: ${migrations.length} migration file(s)`);
