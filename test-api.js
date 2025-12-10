const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing API endpoint: http://localhost:3000/api/articles\n');
    
    const response = await fetch('http://localhost:3000/api/articles');
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    
    console.log('\nResponse data:');
    console.log(JSON.stringify(data, null, 2));
    
    if (Array.isArray(data)) {
      console.log(`\nTotal articles returned: ${data.length}`);
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testAPI();
