require('dotenv').config();
const VapiService = require('../services/vapiService');

/**
 * Example: Using the AgentCall Method
 * 
 * This script demonstrates how to use the VapiService to trigger
 * agent calls programmatically.
 */

async function demonstrateAgentCall() {
  console.log('🤖 VAPI Agent Call Demonstration\n');

  try {
    // Initialize the VAPI service
    const vapiService = new VapiService();
    
    console.log('✅ VAPI Service initialized successfully');

    // Example 1: Make a phone call
    console.log('\n📞 Example 1: Making a phone call...');
    const phoneCallResult = await vapiService.agentCall({
      phoneNumber: '+1234567890', // Replace with actual phone number
      type: 'phone',
      metadata: {
        customerId: '12345',
        purpose: 'audit_followup',
        priority: 'high'
      }
    });

    if (phoneCallResult.success) {
      console.log('✅ Phone call initiated successfully!');
      console.log(`   Call ID: ${phoneCallResult.callId}`);
      console.log(`   Status: ${phoneCallResult.status}`);
      
      // Wait a moment, then check the call status
      console.log('\n⏳ Waiting 2 seconds, then checking call status...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResult = await vapiService.getCallStatus(phoneCallResult.callId);
      if (statusResult.success) {
        console.log(`   Current Status: ${statusResult.status}`);
      }
    } else {
      console.log('❌ Phone call failed:', phoneCallResult.error);
    }

    // Example 2: Make a web call
    console.log('\n🌐 Example 2: Making a web call...');
    const webCallResult = await vapiService.agentCall({
      type: 'web',
      webhookUrl: 'https://your-webhook.com/events', // Replace with actual webhook
      metadata: {
        sessionId: 'web_session_123',
        userType: 'auditor',
        platform: 'web'
      }
    });

    if (webCallResult.success) {
      console.log('✅ Web call initiated successfully!');
      console.log(`   Call ID: ${webCallResult.callId}`);
      console.log(`   Status: ${webCallResult.status}`);
    } else {
      console.log('❌ Web call failed:', webCallResult.error);
    }

    // Example 3: Get agent information
    console.log('\nℹ️  Example 3: Getting agent information...');
    const agentInfo = await vapiService.getAgentInfo();
    
    if (agentInfo.success) {
      console.log('✅ Agent information retrieved:');
      console.log(`   Agent ID: ${agentInfo.agentId}`);
      console.log(`   Agent Name: ${agentInfo.name}`);
    } else {
      console.log('❌ Failed to get agent info:', agentInfo.error);
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

// Example 4: Error handling demonstration
async function demonstrateErrorHandling() {
  console.log('\n🚨 Example 4: Error handling demonstration...');
  
  try {
    const vapiService = new VapiService();
    
    // Try to make a call without required parameters
    console.log('   Testing validation: calling without phone number...');
    const invalidResult = await vapiService.agentCall({
      type: 'phone'
      // Missing phoneNumber - this should fail
    });
    
    if (!invalidResult.success) {
      console.log('   ✅ Validation working correctly:', invalidResult.message);
    }
    
  } catch (error) {
    console.log('   ✅ Error caught and handled:', error.message);
  }
}

// Run the examples
async function runExamples() {
  console.log('🚀 Starting VAPI Agent Call Examples...\n');
  
  await demonstrateAgentCall();
  await demonstrateErrorHandling();
  
  console.log('\n✨ Examples completed!');
  console.log('\n💡 To test with real data:');
  console.log('   1. Update your .env file with real VAPI credentials');
  console.log('   2. Replace placeholder phone numbers and webhook URLs');
  console.log('   3. Run: node examples/agentCallExample.js');
}

// Only run if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  demonstrateAgentCall,
  demonstrateErrorHandling,
  runExamples
}; 