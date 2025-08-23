require('dotenv').config();
const MedicalBillingService = require('./services/medicalBillingService');

/**
 * Test Web Call - No Phone Number Required
 * 
 * This tests VAPI integration without needing phone setup
 */

async function testWebCall() {
  console.log('🌐 Testing VAPI Web Call (No Phone Required)\n');

  try {
    const billingService = new MedicalBillingService();
    
    console.log('🏥 Making medical billing negotiation web call...');
    console.log('👨‍💼 Agent: Alex (VAPI Agent)');
    console.log('📱 Type: Web Call (no phone number needed)\n');

    const callResult = await billingService.initialBillingNegotiation({
      phoneNumber: null, // Not needed for web calls
      type: 'web', // This is the key - web calls don't need phone
      patientInfo: {
        patientId: 'TEST_001',
        patientName: 'Test Patient',
        patientPhone: '+1987654321',
        insuranceInfo: {
          hasInsurance: false,
          insuranceProvider: null,
          policyNumber: null
        },
        financialSituation: 'uninsured_limited_income'
      },
      billingDetails: {
        providerName: 'Test Medical Provider',
        providerPhone: '+19167518647',
        accountNumber: 'TEST123',
        totalBilledAmount: 2500.00,
        totalDisputedAmount: 2500.00,
        billingDate: '2024-12-15',
        dueDate: '2025-01-15'
      },
      disputedItems: [
        {
          serviceCode: '99213',
          serviceDescription: 'Office Visit - Level 3',
          billedAmount: 2500.00,
          disputedAmount: 2500.00,
          disputeReason: 'excessive_charges',
          requestedCorrection: 'reduce_to_standard_rate_1500'
        }
      ],
      negotiationContext: {
        negotiationStage: 'initial_contact',
        objectives: [
          'establish_contact_with_billing_office',
          'present_disputed_charges',
          'request_billing_review',
          'discuss_payment_options'
        ]
      }
    });

    if (callResult.success) {
      console.log('✅ SUCCESS! Web call initiated');
      console.log(`📞 Call ID: ${callResult.callId}`);
      console.log(`📊 Status: ${callResult.status}`);
      console.log(`🔍 Negotiation ID: ${callResult.billingContext.negotiationId}`);
      console.log('\n🎯 What happens next:');
      console.log('   1. VAPI agent "Alex" will start a web conversation');
      console.log('   2. Alex will present the disputed medical charges');
      console.log('   3. Alex will negotiate for better pricing/payment terms');
      console.log('   4. You\'ll receive call updates and final summary');
      
      console.log('\n📋 To check call status:');
      console.log(`   GET /call/${callResult.callId} via VAPI API`);
      console.log('   Or check your VAPI dashboard');
      
    } else {
      console.log('❌ Web call failed:', callResult.error);
      console.log('📝 Message:', callResult.message);
      
      if (callResult.statusCode) {
        console.log('📊 Status Code:', callResult.statusCode);
      }
      
      console.log('\n🔧 Troubleshooting:');
      console.log('   1. Check your VAPI_API_KEY in .env file');
      console.log('   2. Verify your VAPI_AGENT_ID is correct');
      console.log('   3. Check VAPI dashboard for any account issues');
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    console.error('   Stack trace:', error.stack);
  }
}

// Run the test
console.log('🚀 Starting VAPI Web Call Test...\n');
testWebCall().then(() => {
  console.log('\n✨ Web call test completed!');
  console.log('\n💡 Next Steps:');
  console.log('   1. Check your VAPI dashboard for call status');
  console.log('   2. Monitor call progress and transcript');
  console.log('   3. Review final call summary and outcomes');
  console.log('   4. Use the call ID to get detailed information');
}); 