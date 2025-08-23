const axios = require('axios');

/**
 * VAPI Service Class
 * 
 * This class handles all interactions with the VAPI (Voice AI Platform) service
 * using HTTP API calls. The real-time SDK only works in web/mobile environments,
 * so we use the HTTP API for backend server integration.
 */
class VapiService {
  constructor() {
    // VAPI API configuration
    this.apiKey = process.env.VAPI_API_KEY;
    this.agentId = process.env.VAPI_AGENT_ID;
    this.baseURL = 'https://api.vapi.ai';
    
    // Configure axios with VAPI API headers
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * AgentCall Method - Triggers a VAPI agent to start a conversation
   * 
   * This method makes an HTTP POST request to the VAPI API to create a new call.
   * 
   * @param {Object} options - Configuration options for the agent call
   * @param {string} options.phoneNumber - Phone number to call (for phone calls)
   * @param {string} options.webhookUrl - Webhook URL for call events (optional)
   * @param {Object} options.metadata - Additional data to pass to the agent (optional)
   * @param {string} options.type - Type of call: 'phone' or 'web' (default: 'phone')
   * @returns {Promise<Object>} - Call session information
   */
  async agentCall(options = {}) {
    try {
      // Validate required parameters
      if (!this.agentId) {
        throw new Error('VAPI Agent ID not configured. Please set VAPI_AGENT_ID in your environment variables.');
      }

      if (!this.apiKey) {
        throw new Error('VAPI API key not configured. Please check your VAPI_API_KEY configuration.');
      }

      // Set default values
      const {
        phoneNumber,
        webhookUrl,
        metadata = {},
        type = 'phone'
      } = options;

      // Prepare the call configuration for VAPI API
      // Remove agentId from metadata as it should be at root level
      const { agentId: _, ...cleanMetadata } = metadata;
      
      const callConfig = {
        assistantId: this.agentId, // VAPI requires assistantId in request body
        metadata: {
          ...cleanMetadata,
          callType: type,
          timestamp: new Date().toISOString()
        }
      };

      let callResult;

      if (type === 'phone') {
        // Validate phone number for phone calls
        if (!phoneNumber) {
          throw new Error('Phone number is required for phone calls');
        }

        // Create a phone call via VAPI HTTP API
        // VAPI expects assistantId, phoneNumberId, and customer information
        const response = await this.apiClient.post('/call', {
          ...callConfig,
          phoneNumberId: 'a5a01dd0-1cc2-4a87-b72e-04d7b10c4f9b', // VAPI phone number ID
          customer: {
            // VAPI needs customer information for the call
            name: metadata.patientName || 'Unknown Patient',
            email: metadata.patientEmail || 'patient@example.com',
            number: phoneNumber // VAPI needs customer's phone number
          },
          webhookUrl
        });
        
        callResult = response.data;
      } else if (type === 'web') {
        // Create a web call via VAPI HTTP API
        const response = await this.apiClient.post('/call', {
          ...callConfig,
          webhookUrl
        });
        
        callResult = response.data;
      } else {
        throw new Error('Invalid call type. Must be "phone" or "web"');
      }

      console.log(`Agent call initiated successfully:`, {
        callId: callResult.id,
        status: callResult.status,
        type: type,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        callId: callResult.id,
        status: callResult.status,
        message: 'Agent call initiated successfully',
        data: callResult
      };

    } catch (error) {
      console.error('Error initiating agent call:', error);
      
      // Handle different types of errors
      if (error.response) {
        // VAPI API returned an error response
        return {
          success: false,
          error: error.response.data?.message || error.response.statusText,
          message: `VAPI API error: ${error.response.status}`,
          statusCode: error.response.status
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: error.message,
          message: 'Network error - could not reach VAPI API'
        };
      } else {
        // Other error
        return {
          success: false,
          error: error.message,
          message: 'Failed to initiate agent call'
        };
      }
    }
  }

  /**
   * Get Call Status - Check the current status of an active call
   * 
   * @param {string} callId - The ID of the call to check
   * @returns {Promise<Object>} - Current call status and information
   */
  async getCallStatus(callId) {
    try {
      const response = await this.apiClient.get(`/call/${callId}`);
      const call = response.data;
      
      return {
        success: true,
        callId: call.id,
        status: call.status,
        data: call
      };
    } catch (error) {
      console.error('Error getting call status:', error);
      
      if (error.response) {
        return {
          success: false,
          error: error.response.data?.message || error.response.statusText,
          message: `Failed to get call status: ${error.response.status}`
        };
      } else {
        return {
          success: false,
          error: error.message,
          message: 'Failed to get call status'
        };
      }
    }
  }

  /**
   * End Call - Terminate an active call
   * 
   * @param {string} callId - The ID of the call to end
   * @returns {Promise<Object>} - Result of ending the call
   */
  async endCall(callId) {
    try {
      const response = await this.apiClient.post(`/call/${callId}/end`);
      const result = response.data;
      
      return {
        success: true,
        callId: callId,
        message: 'Call ended successfully',
        data: result
      };
    } catch (error) {
      console.error('Error ending call:', error);
      
      if (error.response) {
        return {
          success: false,
          error: error.response.data?.message || error.response.statusText,
          message: `Failed to end call: ${error.response.status}`
        };
      } else {
        return {
          success: false,
          error: error.message,
          message: 'Failed to end call'
        };
      }
    }
  }

  /**
   * Get Agent Information - Retrieve details about the configured agent
   * 
   * @returns {Promise<Object>} - Agent information
   */
  async getAgentInfo() {
    try {
      const response = await this.apiClient.get(`/agent/${this.agentId}`);
      const agent = response.data;
      
      return {
        success: true,
        agentId: agent.id,
        name: agent.name,
        data: agent
      };
    } catch (error) {
      console.error('Error getting agent info:', error);
      
      if (error.response) {
        return {
          success: false,
          error: error.response.data?.message || error.response.statusText,
          message: `Failed to get agent info: ${error.response.status}`
        };
      } else {
        return {
          success: false,
          error: error.message,
          message: 'Failed to get agent information'
        };
      }
    }
  }

  /**
   * Test API Connection - Verify the VAPI API is accessible
   * 
   * @returns {Promise<Object>} - Connection test result
   */
  async testConnection() {
    try {
      const response = await this.apiClient.get('/agent');
      return {
        success: true,
        message: 'VAPI API connection successful',
        statusCode: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'VAPI API connection failed'
      };
    }
  }
}

module.exports = VapiService; 