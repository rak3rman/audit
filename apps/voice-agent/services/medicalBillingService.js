const VapiService = require('./vapiService');

/**
 * Medical Billing Negotiation Service Class
 * 
 * This service handles medical billing negotiation calls through the VAPI agent "Alex"
 * who calls medical providers' billing offices on behalf of patients to negotiate
 * disputed medical bills and obtain updated pricing information.
 */
class MedicalBillingService {
  constructor() {
    // Initialize the base VAPI service
    this.vapiService = new VapiService();
    
    // Medical billing specific configuration
    this.billingConfig = {
      defaultAgent: '', // Your VAPI agent name
      defaultPriority: 'high',
      businessHours: {
        start: '8:00',
        end: '17:00',
        timezone: 'America/New_York'
      },
      callTypes: {
        initial_negotiation: 'initial_billing_negotiation',
        follow_up: 'billing_follow_up',
        payment_arrangement: 'payment_arrangement_discussion',
        dispute_resolution: 'billing_dispute_resolution'
      },
      // Common medical billing negotiation points
      negotiationPoints: [
        'uninsured_discount',
        'cash_payment_discount',
        'payment_plan_options',
        'billing_error_correction',
        'duplicate_charge_removal',
        'insurance_reprocessing',
        'charity_care_eligibility',
        'sliding_scale_application'
      ]
    };
  }

  /**
   * MEDICAL BILLING NEGOTIATION CALL - Main method for medical billing calls
   * 
   * This method initiates a call through agent "Alex" to negotiate medical bills
   * with the provider's billing office. Alex will discuss disputed charges and
   * negotiate better pricing on behalf of the patient.
   * 
   * @param {Object} billingRequest - Medical billing negotiation request
   * @param {string} billingRequest.phoneNumber - Billing office phone number
   * @param {Object} billingRequest.patientInfo - Patient information
   * @param {Object} billingRequest.billingDetails - Billing information
   * @param {Array} billingRequest.disputedItems - Items being disputed/negotiated
   * @param {Object} billingRequest.negotiationContext - Context for negotiation
   * @param {string} billingRequest.callType - Type of billing call
   * @returns {Promise<Object>} - Call result with negotiation context
   */
  async initiateBillingNegotiation(billingRequest) {
    try {
      console.log('🏥 Initiating medical billing negotiation call:', billingRequest);

      // Step 1: Validate and enrich the billing request
      const enrichedRequest = this.enrichBillingRequest(billingRequest);
      
      // Step 2: Build comprehensive billing negotiation context
      const negotiationContext = this.buildNegotiationContext(enrichedRequest);
      
      // Step 3: Make the call through agent "Alex"
      const callResult = await this.vapiService.agentCall({
        phoneNumber: enrichedRequest.phoneNumber,
        type: 'phone',
        metadata: {
          ...negotiationContext,
          agentName: this.billingConfig.defaultAgent,
          callPurpose: 'medical_billing_negotiation',
          expectedOutcomes: [
            'negotiated_pricing',
            'payment_plan_options',
            'billing_corrections',
            'discount_eligibility'
          ]
        }
      });

      // Step 4: Log and return the result with negotiation context
      if (callResult.success) {
        console.log('✅ Medical billing negotiation call successful:', {
          callId: callResult.callId,
          patientId: enrichedRequest.patientInfo.patientId,
          providerName: enrichedRequest.billingDetails.providerName,
          totalDisputedAmount: enrichedRequest.billingDetails.totalDisputedAmount
        });
        
        // Log the negotiation attempt
        await this.logBillingNegotiation(enrichedRequest, callResult);
      }

      return {
        ...callResult,
        billingContext: enrichedRequest,
        negotiationContext: negotiationContext
      };

    } catch (error) {
      console.error('❌ Error in medical billing negotiation:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to initiate medical billing negotiation call',
        billingContext: billingRequest
      };
    }
  }

  /**
   * INITIAL BILLING NEGOTIATION - First call to discuss disputed charges
   * 
   * @param {Object} initialRequest - Initial negotiation request
   * @returns {Promise<Object>} - Initial negotiation call result
   */
  async initialBillingNegotiation(initialRequest) {
    const billingRequest = {
      ...initialRequest,
      callType: 'initial_negotiation',
      negotiationContext: {
        ...initialRequest.negotiationContext,
        negotiationStage: 'initial_contact',
        objectives: [
          'establish_contact_with_billing_office',
          'present_disputed_charges',
          'request_billing_review',
          'discuss_payment_options'
        ]
      }
    };

    return await this.initiateBillingNegotiation(billingRequest);
  }

  /**
   * FOLLOW-UP NEGOTIATION - Follow-up call after initial contact
   * 
   * @param {Object} followUpRequest - Follow-up negotiation request
   * @returns {Promise<Object>} - Follow-up call result
   */
  async followUpNegotiation(followUpRequest) {
    const billingRequest = {
      ...followUpRequest,
      callType: 'follow_up',
      negotiationContext: {
        ...followUpRequest.negotiationContext,
        negotiationStage: 'follow_up',
        previousCallId: followUpRequest.previousCallId,
        objectives: [
          'check_on_previous_requests',
          'discuss_updated_pricing',
          'negotiate_further_discounts',
          'finalize_payment_terms'
        ]
      }
    };

    return await this.initiateBillingNegotiation(billingRequest);
  }

  /**
   * PAYMENT ARRANGEMENT CALL - Discuss payment plan options
   * 
   * @param {Object} paymentRequest - Payment arrangement request
   * @returns {Promise<Object>} - Payment arrangement call result
   */
  async discussPaymentArrangement(paymentRequest) {
    const billingRequest = {
      ...paymentRequest,
      callType: 'payment_arrangement',
      negotiationContext: {
        ...paymentRequest.negotiationContext,
        negotiationStage: 'payment_arrangement',
        objectives: [
          'discuss_payment_plan_options',
          'negotiate_monthly_payment_amount',
          'request_interest_free_terms',
          'discuss_lump_sum_discounts'
        ]
      }
    };

    return await this.initiateBillingNegotiation(billingRequest);
  }

  /**
   * BILLING DISPUTE RESOLUTION - Resolve specific billing disputes
   * 
   * @param {Object} disputeRequest - Dispute resolution request
   * @returns {Promise<Object>} - Dispute resolution call result
   */
  async resolveBillingDispute(disputeRequest) {
    const billingRequest = {
      ...disputeRequest,
      callType: 'dispute_resolution',
      negotiationContext: {
        ...disputeRequest.negotiationContext,
        negotiationStage: 'dispute_resolution',
        objectives: [
          'present_evidence_of_billing_errors',
          'request_charge_corrections',
          'discuss_duplicate_charge_removal',
          'negotiate_corrected_pricing'
        ]
      }
    };

    return await this.initiateBillingNegotiation(billingRequest);
  }

  /**
   * BULK BILLING NEGOTIATIONS - Handle multiple medical bills simultaneously
   * 
   * @param {Array} billingRequests - Array of billing negotiation requests
   * @returns {Promise<Array>} - Results for all negotiations
   */
  async bulkBillingNegotiations(billingRequests) {
    console.log(`📋 Processing ${billingRequests.length} medical billing negotiations`);
    
    const results = [];
    
    for (const request of billingRequests) {
      try {
        // Add delay between calls to avoid overwhelming the system
        if (results.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Longer delay for medical calls
        }
        
        const result = await this.initiateBillingNegotiation(request);
        results.push(result);
        
        console.log(`   ✅ Processed: ${request.billingDetails?.providerName || 'Unknown Provider'}`);
        
      } catch (error) {
        console.error(`   ❌ Failed: ${request.billingDetails?.providerName || 'Unknown Provider'}`, error);
        results.push({
          success: false,
          error: error.message,
          billingContext: request
        });
      }
    }
    
    return results;
  }

  // ===== PRIVATE HELPER METHODS =====

  /**
   * Enrich the billing request with additional information
   */
  enrichBillingRequest(billingRequest) {
    return {
      ...billingRequest,
      negotiationId: this.generateNegotiationId(),
      timestamp: new Date().toISOString(),
      priority: billingRequest.priority || this.billingConfig.defaultPriority,
      businessHours: this.isWithinBusinessHours() ? 'business_hours' : 'after_hours',
      callType: billingRequest.callType || 'initial_negotiation'
    };
  }

  /**
   * Build comprehensive negotiation context for the VAPI agent
   */
  buildNegotiationContext(billingRequest) {
    const { patientInfo, billingDetails, disputedItems, negotiationContext } = billingRequest;
    
    return {
      // Core negotiation information
      negotiationId: billingRequest.negotiationId,
      callType: billingRequest.callType,
      timestamp: billingRequest.timestamp,
      priority: billingRequest.priority,
      businessHours: billingRequest.businessHours,
      
      // Patient information
      patientId: patientInfo.patientId,
      patientName: patientInfo.patientName,
      patientPhone: patientInfo.patientPhone,
      insuranceInfo: patientInfo.insuranceInfo,
      financialSituation: patientInfo.financialSituation,
      
      // Billing details
      providerName: billingDetails.providerName,
      providerPhone: billingDetails.providerPhone,
      accountNumber: billingDetails.accountNumber,
      totalBilledAmount: billingDetails.totalBilledAmount,
      totalDisputedAmount: billingDetails.totalDisputedAmount,
      billingDate: billingDetails.billingDate,
      dueDate: billingDetails.dueDate,
      
      // Disputed items and negotiation points
      disputedItems: disputedItems.map(item => ({
        serviceCode: item.serviceCode,
        serviceDescription: item.serviceDescription,
        billedAmount: item.billedAmount,
        disputedAmount: item.disputedAmount,
        disputeReason: item.disputeReason,
        requestedCorrection: item.requestedCorrection
      })),
      
      // Negotiation context and objectives
      negotiationStage: negotiationContext.negotiationStage,
      objectives: negotiationContext.objectives,
      previousAttempts: negotiationContext.previousAttempts || [],
      supportingDocuments: negotiationContext.supportingDocuments || [],
      
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
      ],
      
      // System information
      systemVersion: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  /**
   * Check if current time is within business hours
   */
  isWithinBusinessHours() {
    const now = new Date();
    const currentHour = now.getHours();
    const startHour = parseInt(this.billingConfig.businessHours.start.split(':')[0]);
    const endHour = parseInt(this.billingConfig.businessHours.end.split(':')[0]);
    
    return currentHour >= startHour && currentHour < endHour;
  }

  /**
   * Generate a unique negotiation ID
   */
  generateNegotiationId() {
    return `NEGOTIATION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log the billing negotiation for tracking and reporting
   */
  async logBillingNegotiation(billingRequest, callResult) {
    // This is where you would log to your database, analytics system, etc.
    const logEntry = {
      timestamp: new Date().toISOString(),
      negotiationId: billingRequest.negotiationId,
      callId: callResult.callId,
      callType: billingRequest.callType,
      patientId: billingRequest.patientInfo.patientId,
      providerName: billingRequest.billingDetails.providerName,
      totalDisputedAmount: billingRequest.billingDetails.totalDisputedAmount,
      status: callResult.success ? 'call_initiated' : 'call_failed',
      metadata: billingRequest
    };
    
    console.log('📝 Medical billing negotiation logged:', logEntry);
    
    // TODO: Implement your logging logic here
    // await database.billingNegotiations.insert(logEntry);
    // await analytics.track('billing_negotiation_initiated', logEntry);
    
    return logEntry;
  }

  /**
   * Get negotiation history for a specific patient
   */
  async getNegotiationHistory(patientId, filters = {}) {
    // TODO: Implement your database query logic here
    console.log('📊 Getting negotiation history for patient:', patientId, filters);
    
    // Placeholder - replace with actual database query
    return {
      success: true,
      message: 'Negotiation history retrieved',
      data: [],
      filters: filters,
      patientId: patientId
    };
  }

  /**
   * Get provider-specific negotiation history
   */
  async getProviderNegotiationHistory(providerName, filters = {}) {
    // TODO: Implement your database query logic here
    console.log('📊 Getting negotiation history for provider:', providerName, filters);
    
    // Placeholder - replace with actual database query
    return {
      success: true,
      message: 'Provider negotiation history retrieved',
      data: [],
      filters: filters,
      providerName: providerName
    };
  }
}

module.exports = MedicalBillingService; 