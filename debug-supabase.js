const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://opcbwsfdhergcjjobryp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wY2J3c2ZkaGVyZ2Nqam9icnlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE0NTIxMSwiZXhwIjoyMDYzNzIxMjExfQ.m2yISMmhwQjoEMmPDDN8XTFT5_ojSmlklZJJ49kuMQg';

async function testSupabase() {
  console.log('Testing direct Supabase connection...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('1. Testing basic connection with anon key...');
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wY2J3c2ZkaGVyZ2Nqam9icnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNDUyMTEsImV4cCI6MjA2MzcyMTIxMX0.f0DSkDqZ-h8bup57qf8z0aOaJ3fLTf8fDfxgvHn-G6Q';
    const supabaseAnon = createClient(supabaseUrl, anonKey);
    
    const { data: health, error: healthError } = await supabaseAnon
      .from('companies')
      .select('count')
      .limit(1);
      
    if (healthError) {
      console.error('Anon key health check error:', healthError);
    }
    
    console.log('2. Testing with service role key...');
    const { data: serviceData, error: serviceError } = await supabase
      .from('companies')
      .select('count')
      .limit(1);
      
    if (serviceError) {
      console.error('Service role health check error:', serviceError);
    }
    
    console.log('3. Testing specific company query...');
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('access_code', 'DEMO2024')
      .single();

    if (error) {
      console.error('Query error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('✅ Query successful:', data);
    }
    
  } catch (e) {
    console.error('Catch block error:', e);
  }
}

testSupabase();