require('dotenv').config();
const MedicalBillingService = require('./services/medicalBillingService');

/**
 * Simple Test: Call (916) 751-8647
 * 
 * This script makes a single call to test your VAPI agent
 * calling the specific number you requested.
 */

async function testCall916() {
  console.log('📞 Testing VAPI Agent Call to (815) 520-6031\n');

  try {
    const billingService = new MedicalBillingService();
    
    console.log('🏥 Making medical billing negotiation call...');
    console.log('📞 Target Number: (815) 520-6031');
    console.log('👨‍💼 Agent: Alex (VAPI Agent)\n');

    const callResult = await billingService.initialBillingNegotiation({
      phoneNumber: '+18155206031', // (815) 520-6031
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
        providerPhone: '+18155206031',
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
      console.log('✅ SUCCESS! Call initiated to (815) 520-6031');
      console.log(`📞 Call ID: ${callResult.callId}`);
      console.log(`📊 Status: ${callResult.status}`);
      console.log(`🔍 Negotiation ID: ${callResult.billingContext.negotiationId}`);
      console.log('\n🎯 What happens next:');
      console.log('   1. VAPI agent "Alex" will call (815) 520-6031');
      console.log('   2. Alex will introduce himself and explain the purpose');
      console.log('   3. Alex will present the disputed medical charges');
      console.log('   4. Alex will negotiate for better pricing/payment terms');
      console.log('   5. You\'ll receive call updates and final summary');
      
      console.log('\n📋 To check call status:');
      console.log(`   GET /call/${callResult.callId} via VAPI API`);
      console.log('   Or implement webhook handling for real-time updates');
      
    } else {
      console.log('❌ Call failed:', callResult.error);
      console.log('📝 Message:', callResult.message);
      
      if (callResult.statusCode) {
        console.log('📊 Status Code:', callResult.statusCode);
      }
      
      console.log('\n🔧 Troubleshooting:');
      console.log('   1. Check your VAPI_API_KEY in .env file');
      console.log('   2. Verify your VAPI_AGENT_ID is correct');
      console.log('   3. Ensure VAPI has outbound calling capability');
      console.log('   4. Check VAPI dashboard for any account issues');
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    console.error('   Stack trace:', error.stack);
  }
}

// Run the test
console.log('🚀 Starting VAPI Agent Call Test...\n');
testCall916().then(() => {
  console.log('\n✨ Test completed!');
  console.log('\n💡 Next Steps:');
  console.log('   1. Check your VAPI dashboard for call status');
  console.log('   2. Monitor call progress and transcript');
  console.log('   3. Review final call summary and outcomes');
  console.log('   4. Use the call ID to get detailed information');
}); 