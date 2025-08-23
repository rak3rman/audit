require('dotenv').config();
const axios = require('axios');

/**
 * Check VAPI Call Status
 * 
 * This script checks the current status of a VAPI call
 * to see if it actually connected and is in progress.
 */

async function checkCallStatus() {
  console.log('🔍 Checking VAPI Call Status\n');

  try {
    const apiKey = process.env.VAPI_API_KEY;
    const callId = '9ab059ad-05b9-4dcc-83f6-f6ef2413a805'; // From the last test
    
    if (!apiKey) {
      console.log('❌ Missing VAPI API key in .env file');
      return;
    }

    console.log('✅ VAPI API key found');
    console.log(`📞 Checking status for Call ID: ${callId}\n`);

    const apiClient = axios.create({
      baseURL: 'https://api.vapi.ai',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    try {
      const response = await apiClient.get(`/call/${callId}`);
      console.log('✅ Call status retrieved successfully!');
      console.log(`📞 Call ID: ${response.data.id}`);
      console.log(`📊 Current Status: ${response.data.status}`);
      console.log(`⏰ Created At: ${response.data.createdAt}`);
      
      if (response.data.startTime) {
        console.log(`🚀 Started At: ${response.data.startTime}`);
      }
      
      if (response.data.duration) {
        console.log(`⏱️  Duration: ${response.data.duration} seconds`);
      }
      
      if (response.data.transcript) {
        console.log(`📝 Transcript Available: ${response.data.transcript.length} characters`);
      }
      
      if (response.data.summary) {
        console.log(`📋 Summary: ${response.data.summary}`);
      }
      
      console.log('\n📋 Full Call Data:');
      console.log(JSON.stringify(response.data, null, 2));
      
      // Interpret the status
      console.log('\n🎯 Status Interpretation:');
      switch (response.data.status) {
        case 'queued':
          console.log('   📋 Call is queued and waiting to be processed');
          break;
        case 'ringing':
          console.log('   🔔 Call is ringing the target number');
          break;
        case 'answered':
          console.log('   📞 Call was answered and is connecting');
          break;
        case 'in-progress':
          console.log('   🗣️  Call is in progress - Agent Alex is talking!');
          break;
        case 'completed':
          console.log('   ✅ Call completed successfully');
          break;
        case 'failed':
          console.log('   ❌ Call failed to connect');
          break;
        default:
          console.log(`   ❓ Unknown status: ${response.data.status}`);
      }
      
    } catch (error) {
      console.log('❌ Failed to get call status:');
      if (error.response) {
        console.log(`   📊 Status: ${error.response.status}`);
        console.log(`   📝 Message: ${error.response.data?.message || 'No message'}`);
        console.log(`   🔍 Error: ${error.response.data?.error || 'Unknown error'}`);
      } else {
        console.log(`   🚨 Error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

// Run the check
console.log('🚀 Starting Call Status Check...\n');
checkCallStatus().then(() => {
  console.log('\n✨ Status check completed!');
  console.log('\n💡 If the call is still "queued":');
  console.log('   1. Check your VAPI dashboard for any errors');
  console.log('   2. Verify the phone number ID is configured for outbound calls');
  console.log('   3. Check if there are any account restrictions');
  console.log('   4. Contact VAPI support if the issue persists');
}); 