require('dotenv').config();
const MedicalBillingService = require('../services/medicalBillingService');

/**
 * Example: Using MedicalBillingService for Medical Billing Negotiations
 * 
 * This script shows you how to use your custom MedicalBillingService class
 * to have agent "Alex" call medical providers' billing offices on behalf
 * of patients to negotiate disputed medical bills.
 */

async function demonstrateMedicalBillingService() {
  console.log('🏥 Using MedicalBillingService for Medical Billing Negotiations\n');

  try {
    // Step 1: Initialize your medical billing service
    console.log('1️⃣ Initializing MedicalBillingService...');
    const billingService = new MedicalBillingService();
    console.log('   ✅ Medical billing service ready with agent "Alex"!\n');

    // Step 2: Initial billing negotiation call
    console.log('2️⃣ Making initial billing negotiation call...');
    const initialResult = await billingService.initialBillingNegotiation({
      phoneNumber: '+19167518647', // Replace with actual billing office number
      patientInfo: {
        patientId: 'PAT_001',
        patientName: 'John Smith',
        patientPhone: '',
        insuranceInfo: {
          hasInsurance: false,
          insuranceProvider: null,
          policyNumber: null
        },
        financialSituation: 'uninsured_limited_income'
      },
      billingDetails: {
        providerName: 'City General Hospital',
        providerPhone: '+19167518647',
        accountNumber: 'ACC123456',
        totalBilledAmount: 8500.00,
        totalDisputedAmount: 8500.00,
        billingDate: '2024-12-15',
        dueDate: '2025-01-15'
      },
      disputedItems: [
        {
          serviceCode: '99285',
          serviceDescription: 'Emergency Department Visit - Level 5',
          billedAmount: 2500.00,
          disputedAmount: 2500.00,
          disputeReason: 'excessive_charges_for_standard_visit',
          requestedCorrection: 'reduce_to_standard_rate_1500'
        },
        {
          serviceCode: '80048',
          serviceDescription: 'Comprehensive Metabolic Panel',
          billedAmount: 350.00,
          disputedAmount: 350.00,
          disputeReason: 'duplicate_lab_charges',
          requestedCorrection: 'remove_duplicate_charge'
        },
        {
          serviceCode: '71045',
          serviceDescription: 'Chest X-Ray - 2 Views',
          billedAmount: 450.00,
          disputedAmount: 450.00,
          disputeReason: 'unnecessary_imaging',
          requestedCorrection: 'remove_if_not_medically_necessary'
        }
      ],
      negotiationContext: {
        negotiationStage: 'initial_contact',
        objectives: [
          'establish_contact_with_billing_office',
          'present_disputed_charges',
          'request_billing_review',
          'discuss_payment_options'
        ],
        supportingDocuments: [
          'itemized_bill',
          'medical_records',
          'financial_hardship_documentation'
        ]
      }
    });

    if (initialResult.success) {
      console.log('   ✅ Initial negotiation call successful!');
      console.log(`   📞 Call ID: ${initialResult.callId}`);
      console.log(`   🔍 Negotiation ID: ${initialResult.billingContext.negotiationId}`);
      console.log(`   🏥 Provider: ${initialResult.billingContext.billingDetails.providerName}`);
      console.log(`   💰 Total Disputed: $${initialResult.billingContext.billingDetails.totalDisputedAmount}`);
      console.log(`   📋 Call Type: ${initialResult.billingContext.callType}`);
    } else {
      console.log('   ❌ Initial negotiation call failed:', initialResult.error);
    }

    // Step 3: Follow-up negotiation call
    console.log('\n3️⃣ Making follow-up negotiation call...');
    const followUpResult = await billingService.followUpNegotiation({
      phoneNumber: '+19167518647', // Replace with actual billing office number
      previousCallId: initialResult.callId,
      patientInfo: {
        patientId: 'PAT_001',
        patientName: 'John Smith',
        patientPhone: '+1987654321'
      },
      billingDetails: {
        providerName: 'City General Hospital',
        providerPhone: '+19167518647',
        accountNumber: 'ACC123456',
        totalBilledAmount: 8500.00,
        totalDisputedAmount: 6500.00, // Reduced after initial negotiation
        billingDate: '2024-12-15',
        dueDate: '2025-01-15'
      },
      disputedItems: [
        {
          serviceCode: '99285',
          serviceDescription: 'Emergency Department Visit - Level 5',
          billedAmount: 1500.00, // Already reduced
          disputedAmount: 0.00,
          disputeReason: 'resolved',
          requestedCorrection: 'none'
        },
        {
          serviceCode: '80048',
          serviceDescription: 'Comprehensive Metabolic Panel',
          billedAmount: 350.00,
          disputedAmount: 350.00,
          disputeReason: 'still_duplicate_lab_charges',
          requestedCorrection: 'remove_duplicate_charge'
        },
        {
          serviceCode: '71045',
          serviceDescription: 'Chest X-Ray - 2 Views',
          billedAmount: 450.00,
          disputedAmount: 450.00,
          disputeReason: 'still_unnecessary_imaging',
          requestedCorrection: 'remove_if_not_medically_necessary'
        }
      ],
      negotiationContext: {
        negotiationStage: 'follow_up',
        objectives: [
          'check_on_previous_requests',
          'discuss_updated_pricing',
          'negotiate_further_discounts',
          'finalize_payment_terms'
        ],
        previousAttempts: [
          {
            callId: initialResult.callId,
            date: new Date().toISOString(),
            outcomes: ['reduced_ed_visit_charge', 'pending_lab_and_imaging_review']
          }
        ]
      }
    });

    if (followUpResult.success) {
      console.log('   ✅ Follow-up negotiation call successful!');
      console.log(`   📞 Call ID: ${followUpResult.callId}`);
      console.log(`   🔍 Negotiation ID: ${followUpResult.billingContext.negotiationId}`);
      console.log(`   📊 Previous Call: ${followUpResult.billingContext.negotiationContext.previousCallId}`);
    } else {
      console.log('   ❌ Follow-up negotiation call failed:', followUpResult.error);
    }

    // Step 4: Payment arrangement discussion
    console.log('\n4️⃣ Discussing payment arrangement options...');
    const paymentResult = await billingService.discussPaymentArrangement({
      phoneNumber: '+1234567890', // Replace with actual billing office number
      patientInfo: {
        patientId: 'PAT_001',
        patientName: 'John Smith',
        patientPhone: '+1987654321',
        financialSituation: 'uninsured_limited_income'
      },
      billingDetails: {
        providerName: 'City General Hospital',
        providerPhone: '+1234567890',
        accountNumber: 'ACC123456',
        totalBilledAmount: 6500.00,
        totalDisputedAmount: 2000.00, // Further reduced after follow-up
        billingDate: '2024-12-15',
        dueDate: '2025-01-15'
      },
      negotiationContext: {
        negotiationStage: 'payment_arrangement',
        objectives: [
          'discuss_payment_plan_options',
          'negotiate_monthly_payment_amount',
          'request_interest_free_terms',
          'discuss_lump_sum_discounts'
        ]
      }
    });

    if (paymentResult.success) {
      console.log('   ✅ Payment arrangement call successful!');
      console.log(`   📞 Call ID: ${paymentResult.callId}`);
      console.log(`   💰 Final Amount: $${paymentResult.billingContext.billingDetails.totalDisputedAmount}`);
    } else {
      console.log('   ❌ Payment arrangement call failed:', paymentResult.error);
    }

    // Step 5: Bulk billing negotiations
    console.log('\n5️⃣ Demonstrating bulk billing negotiations...');
    const bulkRequests = [
      {
        phoneNumber: '+1234567890',
        patientInfo: {
          patientId: 'PAT_002',
          patientName: 'Sarah Johnson',
          patientPhone: '+1987654322'
        },
        billingDetails: {
          providerName: 'Medical Center A',
          providerPhone: '+1234567890',
          totalBilledAmount: 3200.00,
          totalDisputedAmount: 3200.00
        },
        disputedItems: [
          {
            serviceCode: '99213',
            serviceDescription: 'Office Visit - Level 3',
            billedAmount: 3200.00,
            disputedAmount: 3200.00,
            disputeReason: 'excessive_charges'
          }
        ],
        negotiationContext: {
          negotiationStage: 'initial_contact',
          objectives: ['establish_contact', 'present_disputed_charges']
        }
      },
      {
        phoneNumber: '+1234567890',
        patientInfo: {
          patientId: 'PAT_003',
          patientName: 'Mike Davis',
          patientPhone: '+1987654323'
        },
        billingDetails: {
          providerName: 'Medical Center B',
          providerPhone: '+1234567890',
          totalBilledAmount: 1800.00,
          totalDisputedAmount: 1800.00
        },
        disputedItems: [
          {
            serviceCode: '80048',
            serviceDescription: 'Lab Work',
            billedAmount: 1800.00,
            disputedAmount: 1800.00,
            disputeReason: 'duplicate_charges'
          }
        ],
        negotiationContext: {
          negotiationStage: 'initial_contact',
          objectives: ['establish_contact', 'present_disputed_charges']
        }
      }
    ];

    const bulkResults = await billingService.bulkBillingNegotiations(bulkRequests);
    console.log(`   📋 Bulk processing completed: ${bulkResults.length} negotiations processed`);

    // Step 6: Get negotiation history
    console.log('\n6️⃣ Getting negotiation history...');
    const historyResult = await billingService.getNegotiationHistory('PAT_001', {
      dateRange: 'last_30_days',
      callType: 'initial_negotiation',
      status: 'call_initiated'
    });

    if (historyResult.success) {
      console.log('   ✅ Negotiation history retrieved successfully');
      console.log(`   📊 Total negotiations: ${historyResult.data.length}`);
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    console.error('   Stack trace:', error.stack);
  }
}

// Function to show the negotiation context structure
function showNegotiationContextStructure() {
  console.log('\n📋 Medical Billing Negotiation Context Structure:\n');
  
  const exampleContext = {
    // Core negotiation information
    negotiationId: 'NEGOTIATION_1755989256948_mfxchci2e',
    callType: 'initial_negotiation',
    timestamp: '2025-08-23T22:47:36.948Z',
    priority: 'high',
    businessHours: 'business_hours',
    
    // Patient information
    patientId: 'PAT_001',
    patientName: 'John Smith',
    patientPhone: '+1987654321',
    insuranceInfo: {
      hasInsurance: false,
      insuranceProvider: null,
      policyNumber: null
    },
    financialSituation: 'uninsured_limited_income',
    
    // Billing details
    providerName: 'City General Hospital',
    providerPhone: '+1234567890',
    accountNumber: 'ACC123456',
    totalBilledAmount: 8500.00,
    totalDisputedAmount: 8500.00,
    billingDate: '2024-12-15',
    dueDate: '2025-01-15',
    
    // Disputed items and negotiation points
    disputedItems: [
      {
        serviceCode: '99285',
        serviceDescription: 'Emergency Department Visit - Level 5',
        billedAmount: 2500.00,
        disputedAmount: 2500.00,
        disputeReason: 'excessive_charges_for_standard_visit',
        requestedCorrection: 'reduce_to_standard_rate_1500'
      }
    ],
    
    // Negotiation context and objectives
    negotiationStage: 'initial_contact',
    objectives: [
      'establish_contact_with_billing_office',
      'present_disputed_charges',
      'request_billing_review',
      'discuss_payment_options'
    ],
    
    // Expected call outcomes
    expectedOutcomes: [
      'updated_billing_amount',
      'payment_plan_options',
      'billing_corrections',
      'discount_eligibility',
      'next_steps_required'
    ],
    
    // Agent instructions for "Alex"
    agentInstructions: [
      'Introduce yourself as Alex, calling on behalf of the patient',
      'Explain the purpose: to discuss disputed medical billing charges',
      'Present each disputed item clearly with supporting information',
      'Request billing review and potential corrections',
      'Negotiate for discounts, payment plans, or charity care',
      'Document all responses and updated pricing information',
      'Provide clear summary of call outcomes and next steps'
    ]
  };
  
  console.log('   📊 Context sent to VAPI agent "Alex":');
  console.log(JSON.stringify(exampleContext, null, 2));
}

// Main execution
async function main() {
  console.log('🚀 Starting Medical Billing Negotiation Demo...\n');
  
  await demonstrateMedicalBillingService();
  showNegotiationContextStructure();
  
  console.log('\n✨ Demo completed!');
  console.log('\n💡 Key Benefits of Your Medical Billing Service:');
  console.log('   • 🏥 Specialized for medical billing negotiations');
  console.log('   • 👨‍💼 Agent "Alex" handles all provider calls');
  console.log('   • 📋 Rich context for disputed medical charges');
  console.log('   • 🔄 Multiple negotiation stages (initial, follow-up, payment)');
  console.log('   • 💰 Tracks billing amounts and negotiation progress');
  console.log('   • 📊 Comprehensive logging and history tracking');
  console.log('   • ⚡ Bulk processing for multiple patients/providers');
  console.log('\n🔧 To customize further:');
  console.log('   1. Update phone numbers in the script');
  console.log('   2. Modify patient and billing information');
  console.log('   3. Add your specific negotiation strategies');
  console.log('   4. Implement database logging in logBillingNegotiation()');
  console.log('   5. Run: node examples/useMedicalBillingService.js');
  console.log('\n🎯 Expected Outcomes from Agent "Alex":');
  console.log('   • Summary of what the medical provider said');
  console.log('   • Updated billing prices (if any)');
  console.log('   • Payment plan options discussed');
  console.log('   • Next steps required from patient');
  console.log('   • Documentation of all agreements made');
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  demonstrateMedicalBillingService,
  showNegotiationContextStructure,
  main
}; 