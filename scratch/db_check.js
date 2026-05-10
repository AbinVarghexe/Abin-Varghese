
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

  if (!url || !key) {
    console.error('Missing Supabase URL or Key');
    return;
  }

  const supabase = createClient(url, key);

  console.log('Checking site_content...');
  const { data: record, error } = await supabase
    .from('site_content')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error querying site_content:', error);
  } else {
    console.log('site_content columns:', Object.keys(record[0] || {}));
  }

  console.log('Checking achievements...');
  const { data: ach, error: achError } = await supabase
    .from('achievements')
    .select('*')
    .limit(1);

  if (achError) {
    console.error('Error querying achievements:', achError);
  } else {
    console.log('achievements columns:', Object.keys(ach[0] || {}));
  }
}

check();
