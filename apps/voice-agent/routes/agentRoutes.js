const express = require('express');
const AgentController = require('../controllers/agentController');

const router = express.Router();
const agentController = new AgentController();

/**
 * Agent Routes
 * 
 * These routes provide HTTP endpoints for interacting with VAPI agents.
 * All routes are prefixed with /api/agent
 */

// POST /api/agent/call - Trigger a new agent call
router.post('/call', agentController.triggerAgentCall.bind(agentController));

// GET /api/agent/call/:callId/status - Get call status
router.get('/call/:callId/status', agentController.getCallStatus.bind(agentController));

// POST /api/agent/call/:callId/end - End an active call
router.post('/call/:callId/end', agentController.endCall.bind(agentController));

// GET /api/agent/info - Get agent information
router.get('/info', agentController.getAgentInfo.bind(agentController));

module.exports = router; 