const VapiService = require('../services/vapiService');

/**
 * Agent Controller
 * 
 * This controller handles HTTP requests related to VAPI agent operations.
 * It provides REST API endpoints for triggering agent calls, checking call status,
 * and managing voice interactions.
 */
class AgentController {
  constructor() {
    // Initialize the VAPI service
    this.vapiService = new VapiService();
  }

  /**
   * POST /api/agent/call
   * 
   * Triggers a new agent call based on the request body parameters.
   * This is the main endpoint you'll use to initiate agent calls.
   */
  async triggerAgentCall(req, res) {
    try {
      const {
        phoneNumber,
        webhookUrl,
        metadata,
        type = 'phone'
      } = req.body;

      // Validate request body
      if (type === 'phone' && !phoneNumber) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required for phone calls'
        });
      }

      // Call the VAPI service to initiate the agent call
      const result = await this.vapiService.agentCall({
        phoneNumber,
        webhookUrl,
        metadata,
        type
      });

      if (result.success) {
        // Return success response with call details
        res.status(200).json({
          success: true,
          message: 'Agent call initiated successfully',
          data: {
            callId: result.callId,
            status: result.status,
            type: type,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        // Return error response
        res.status(500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }

    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * GET /api/agent/call/:callId/status
   * 
   * Retrieves the current status of a specific agent call.
   */
  async getCallStatus(req, res) {
    try {
      const { callId } = req.params;

      if (!callId) {
        return res.status(400).json({
          success: false,
          message: 'Call ID is required'
        });
      }

      const result = await this.vapiService.getCallStatus(callId);

      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }

    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * POST /api/agent/call/:callId/end
   * 
   * Ends an active agent call.
   */
  async endCall(req, res) {
    try {
      const { callId } = req.params;

      if (!callId) {
        return res.status(400).json({
          success: false,
          message: 'Call ID is required'
        });
      }

      const result = await this.vapiService.endCall(callId);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Call ended successfully',
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }

    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * GET /api/agent/info
   * 
   * Retrieves information about the configured VAPI agent.
   */
  async getAgentInfo(req, res) {
    try {
      const result = await this.vapiService.getAgentInfo();

      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }

    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = AgentController; 