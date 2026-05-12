
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
  });
}

async function check() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(url, key);

  console.log('Testing insert into site_content...');
  const { error } = await supabase
    .from('site_content')
    .upsert({ key: 'test_key', value: 'test_value' }, { onConflict: 'key' });

  if (error) {
    console.error('Insert error:', error);
  } else {
    console.log('Insert success!');
  }
}

check();
