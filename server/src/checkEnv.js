require('dotenv').config();
// src/checkEnv.js
const requiredEnvs = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

let missing = false;

requiredEnvs.forEach((v) => {
  if (!process.env[v]) {
    console.warn(`⚠️ Environment variable ${v} is not set!`);
    missing = true;
  }
});

if (missing) {
  console.warn('⚠️ Some critical environment variables are missing. The server may not function properly.');
} else {
  console.log('✅ All required environment variables are set.');
}
