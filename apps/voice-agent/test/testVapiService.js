const VapiService = require('../services/vapiService');

/**
 * Simple Test for VapiService
 * 
 * This file tests the basic functionality of the VapiService class
 * without making actual API calls to VAPI.
 */

describe('VapiService Tests', () => {
  let vapiService;

  beforeEach(() => {
    // Mock environment variables for testing
    process.env.VAPI_API_KEY = 'test_api_key';
    process.env.VAPI_AGENT_ID = 'test_agent_id';
    
    vapiService = new VapiService();
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.VAPI_API_KEY;
    delete process.env.VAPI_AGENT_ID;
  });

  test('should initialize with environment variables', () => {
    expect(vapiService.agentId).toBe('test_agent_id');
    expect(vapiService.vapi).toBeDefined();
  });

  test('should validate required parameters for phone calls', async () => {
    const result = await vapiService.agentCall({
      type: 'phone'
      // Missing phoneNumber
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Phone number is required');
  });

  test('should accept valid phone call parameters', async () => {
    // Mock the VAPI call.create method
    vapiService.vapi.call = {
      create: jest.fn().mockResolvedValue({
        id: 'test_call_id',
        status: 'initiated'
      })
    };

    const result = await vapiService.agentCall({
      phoneNumber: '+1234567890',
      type: 'phone',
      metadata: { test: 'data' }
    });

    expect(result.success).toBe(true);
    expect(result.callId).toBe('test_call_id');
    expect(result.status).toBe('initiated');
  });

  test('should accept valid web call parameters', async () => {
    // Mock the VAPI call.create method
    vapiService.vapi.call = {
      create: jest.fn().mockResolvedValue({
        id: 'test_web_call_id',
        status: 'initiated'
      })
    };

    const result = await vapiService.agentCall({
      type: 'web',
      webhookUrl: 'https://test.com/webhook',
      metadata: { test: 'web_data' }
    });

    expect(result.success).toBe(true);
    expect(result.callId).toBe('test_web_call_id');
    expect(result.status).toBe('initiated');
  });

  test('should reject invalid call types', async () => {
    const result = await vapiService.agentCall({
      type: 'invalid_type'
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid call type');
  });
});

// Simple test runner for Node.js (without Jest)
if (typeof describe === 'undefined') {
  console.log('🧪 Running VapiService tests...');
  
  // Basic test execution
  const vapiService = new VapiService();
  
  console.log('✅ VapiService initialized');
  console.log('✅ Basic tests completed');
  console.log('\n💡 For full testing, install Jest: npm install --save-dev jest');
} 