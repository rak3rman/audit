require('dotenv').config();
const axios = require('axios');

/**
 * Test Different VAPI Call Formats
 * 
 * This script tests various VAPI call configurations to find
 * what works for outbound calling.
 */

async function testVapiCallFormats() {
  console.log('🧪 Testing Different VAPI Call Formats for Outbound Calls\n');

  try {
    const apiKey = process.env.VAPI_API_KEY;
    const agentId = process.env.VAPI_AGENT_ID;
    
    if (!apiKey || !agentId) {
      console.log('❌ Missing VAPI credentials in .env file');
      return;
    }

    console.log('✅ VAPI credentials found');
    console.log(`   Agent ID: ${agentId}`);
    console.log(`   API Key: ${apiKey.substring(0, 8)}...\n`);

    const apiClient = axios.create({
      baseURL: 'https://api.vapi.ai',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Test different call formats
    const testFormats = [
      {
        name: 'Format 1: Basic with targetNumber',
        data: {
          assistantId: agentId,
          phoneNumberId: 'a5a01dd0-1cc2-4a87-b72e-04d7b10c4f9b',
          customer: {
            name: 'Test Patient',
            email: 'test@example.com',
            number: '+18155206031'
          },
          targetNumber: '+18155206031',
          metadata: { test: 'format1' }
        }
      },
      {
        name: 'Format 2: With to field',
        data: {
          assistantId: agentId,
          phoneNumberId: 'a5a01dd0-1cc2-4a87-b72e-04d7b10c4f9b',
          customer: {
            name: 'Test Patient',
            email: 'test@example.com',
            number: '+18155206031'
          },
          to: '+18155206031',
          metadata: { test: 'format2' }
        }
      },
      {
        name: 'Format 3: With phone field',
        data: {
          assistantId: agentId,
          phoneNumberId: 'a5a01dd0-1cc2-4a87-b72e-04d7b10c4f9b',
          customer: {
            name: 'Test Patient',
            email: 'test@example.com',
            number: '+18155206031'
          },
          phone: '+18155206031',
          metadata: { test: 'format3' }
        }
      },
      {
        name: 'Format 4: Minimal required fields',
        data: {
          assistantId: agentId,
          phoneNumberId: 'a5a01dd0-1cc2-4a87-b72e-04d7b10c4f9b',
          customer: {
            name: 'Test Patient',
            email: 'test@example.com',
            number: '+18155206031'
          },
          metadata: { test: 'format4' }
        }
      }
    ];

    for (let i = 0; i < testFormats.length; i++) {
      const format = testFormats[i];
      console.log(`${i + 1}️⃣ Testing: ${format.name}`);
      
      try {
        console.log('   📤 Sending request:', JSON.stringify(format.data, null, 2));
        
        const response = await apiClient.post('/call', format.data);
        console.log('   ✅ SUCCESS! Call initiated:');
        console.log(`   📞 Call ID: ${response.data.id}`);
        console.log(`   📊 Status: ${response.data.status}`);
        console.log(`   📋 Response:`, JSON.stringify(response.data, null, 2));
        
        // If we get here, we found a working format!
        console.log('\n🎉 SUCCESS! Found working format!');
        console.log('   Use this format in your VapiService:');
        console.log('   ', JSON.stringify(format.data, null, 2));
        
        // Test if this call actually connects
        console.log('\n⏳ Waiting 30 seconds to see if call connects...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        // Check call status
        try {
          const statusResponse = await apiClient.get(`/call/${response.data.id}`);
          console.log('   📊 Call Status Update:');
          console.log(`   📊 Current Status: ${statusResponse.data.status}`);
          console.log(`   📋 Full Status:`, JSON.stringify(statusResponse.data, null, 2));
        } catch (statusError) {
          console.log('   ❌ Failed to get call status:', statusError.response?.data?.message || statusError.message);
        }
        
        return;
        
      } catch (error) {
        console.log('   ❌ Failed:');
        if (error.response) {
          console.log(`   📊 Status: ${error.response.status}`);
          console.log(`   📝 Message: ${error.response.data?.message || 'No message'}`);
          console.log(`   🔍 Error: ${error.response.data?.error || 'Unknown error'}`);
        } else {
          console.log(`   🚨 Error: ${error.message}`);
        }
        console.log('');
      }
    }

    console.log('❌ All formats failed. Let\'s check the VAPI documentation.');
    console.log('   The API might require additional fields or different structure.');

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

// Run the test
testVapiCallFormats().then(() => {
  console.log('\n✨ Format testing completed!');
}); 