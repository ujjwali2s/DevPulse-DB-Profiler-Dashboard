const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ahxzprinpnglibxwhfsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoeHpwcmlucG5nbGlieHdoZnN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk3NzE0NCwiZXhwIjoyMDYzNTUzMTQ0fQ.bEgU8IaZTvmBRLm8geH103Pc48Ytq4FsJqUqP4GjIaE'; // replace with your actual key

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };