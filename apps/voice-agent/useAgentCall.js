require('dotenv').config();
const VapiService = require('./services/vapiService');

/**
 * Simple Script: Using AgentCall Method Directly
 * 
 * This script shows you how to use the AgentCall method
 * directly in your JavaScript code without HTTP requests.
 */

async function useAgentCall() {
  console.log('🤖 Using AgentCall Method Directly\n');

  try {
    // Step 1: Initialize the VAPI service
    console.log('1️⃣ Initializing VAPI service...');
    const vapiService = new VapiService();
    console.log('   ✅ VAPI service ready!\n');

    // Step 2: Make a phone call using AgentCall
    console.log('2️⃣ Making a phone call with AgentCall method...');
    const phoneCallResult = await vapiService.agentCall({
      phoneNumber: '+1234567890', // Replace with actual phone number
      type: 'phone',
      metadata: {
        customerId: '12345',
        purpose: 'audit_followup',
        priority: 'high',
        timestamp: new Date().toISOString()
      }
    });

    // Step 3: Handle the result
    if (phoneCallResult.success) {
      console.log('   ✅ Phone call successful!');
      console.log(`   📞 Call ID: ${phoneCallResult.callId}`);
      console.log(`   📊 Status: ${phoneCallResult.status}`);
      console.log(`   📝 Message: ${phoneCallResult.message}`);
      
      // Step 4: Check call status (optional)
      console.log('\n3️⃣ Checking call status...');
      const statusResult = await vapiService.getCallStatus(phoneCallResult.callId);
      if (statusResult.success) {
        console.log(`   📊 Current Status: ${statusResult.status}`);
      }
      
    } else {
      console.log('   ❌ Phone call failed:');
      console.log(`   🚨 Error: ${phoneCallResult.error}`);
      console.log(`   📝 Message: ${phoneCallResult.message}`);
    }

    // Step 5: Make a web call (alternative)
    console.log('\n4️⃣ Making a web call with AgentCall method...');
    const webCallResult = await vapiService.agentCall({
      type: 'web',
      webhookUrl: 'https://your-webhook.com/events', // Replace with actual webhook
      metadata: {
        sessionId: 'web_session_123',
        userType: 'auditor',
        platform: 'web',
        timestamp: new Date().toISOString()
      }
    });

    if (webCallResult.success) {
      console.log('   ✅ Web call successful!');
      console.log(`   🌐 Call ID: ${webCallResult.callId}`);
      console.log(`   📊 Status: ${webCallResult.status}`);
    } else {
      console.log('   ❌ Web call failed:', webCallResult.error);
    }

    // Step 6: Get agent information
    console.log('\n5️⃣ Getting agent information...');
    const agentInfo = await vapiService.getAgentInfo();
    if (agentInfo.success) {
      console.log('   ✅ Agent info retrieved:');
      console.log(`   🤖 Agent ID: ${agentInfo.agentId}`);
      console.log(`   📛 Agent Name: ${agentInfo.name}`);
    } else {
      console.log('   ❌ Failed to get agent info:', agentInfo.error);
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    console.error('   Stack trace:', error.stack);
  }
}

// Function to demonstrate error handling
async function demonstrateErrorHandling() {
  console.log('\n🚨 Error Handling Examples:\n');
  
  try {
    const vapiService = new VapiService();
    
    // Example 1: Missing phone number
    console.log('1️⃣ Testing validation - missing phone number:');
    const missingPhoneResult = await vapiService.agentCall({
      type: 'phone'
      // Missing phoneNumber - this should fail validation
    });
    
    if (!missingPhoneResult.success) {
      console.log('   ✅ Validation working: Missing phone number caught');
      console.log(`   📝 Error: ${missingPhoneResult.message}`);
    }
    
    // Example 2: Invalid call type
    console.log('\n2️⃣ Testing validation - invalid call type:');
    const invalidTypeResult = await vapiService.agentCall({
      type: 'invalid_type',
      phoneNumber: '+1234567890'
    });
    
    if (!invalidTypeResult.success) {
      console.log('   ✅ Validation working: Invalid call type caught');
      console.log(`   📝 Error: ${invalidTypeResult.message}`);
    }
    
  } catch (error) {
    console.log('   ✅ Error caught and handled:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting AgentCall Direct Usage Demo...\n');
  
  await useAgentCall();
  await demonstrateErrorHandling();
  
  console.log('\n✨ Demo completed!');
  console.log('\n💡 Key Points:');
  console.log('   • AgentCall method is in VapiService class');
  console.log('   • Call it directly: vapiService.agentCall(options)');
  console.log('   • Returns { success, callId, status, message }');
  console.log('   • Handle errors with try/catch and result.success check');
  console.log('\n🔧 To customize:');
  console.log('   1. Update phone numbers in the script');
  console.log('   2. Modify metadata for your use case');
  console.log('   3. Add your webhook URLs');
  console.log('   4. Run: node useAgentCall.js');
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  useAgentCall,
  demonstrateErrorHandling,
  main
}; 