# Audit Backend - VAPI Agent Integration

This backend service provides a complete integration with VAPI (Voice AI Platform) to trigger and manage AI agent calls.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd apps/backend
npm install
```

### 2. Environment Setup
Copy the environment file and configure your VAPI credentials:
```bash
cp env.example .env
```

Edit `.env` with your actual VAPI credentials:
```env
VAPI_API_KEY=your_actual_vapi_api_key
VAPI_AGENT_ID=your_actual_agent_id
PORT=3001
NODE_ENV=development
```

### 3. Start the Server
```bash
npm run dev
```

The server will start on port 3001 (or the port specified in your .env file).

## 📞 Using the AgentCall Method

The `AgentCall` method is the core functionality that triggers VAPI agents to start conversations. Here's how to use it:

### Via HTTP API (Recommended)

**Trigger a Phone Call:**
```bash
curl -X POST http://localhost:3001/api/agent/call \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "type": "phone",
    "metadata": {
      "customerId": "12345",
      "purpose": "audit_followup"
    }
  }'
```

**Trigger a Web Call:**
```bash
curl -X POST http://localhost:3001/api/agent/call \
  -H "Content-Type: application/json" \
  -d '{
    "type": "web",
    "webhookUrl": "https://your-webhook.com/events",
    "metadata": {
      "sessionId": "abc123",
      "userType": "auditor"
    }
  }'
```

### Via JavaScript/Node.js

```javascript
const VapiService = require('./services/vapiService');

const vapiService = new VapiService();

// Make a phone call
const phoneCallResult = await vapiService.agentCall({
  phoneNumber: '+1234567890',
  type: 'phone',
  metadata: {
    customerId: '12345',
    purpose: 'audit_followup'
  }
});

// Make a web call
const webCallResult = await vapiService.agentCall({
  type: 'web',
  webhookUrl: 'https://your-webhook.com/events',
  metadata: {
    sessionId: 'abc123',
    userType: 'auditor'
  }
});
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/agent/call` | Trigger a new agent call |
| `GET` | `/api/agent/call/:callId/status` | Get call status |
| `POST` | `/api/agent/call/:callId/end` | End an active call |
| `GET` | `/api/agent/info` | Get agent information |
| `GET` | `/health` | Health check |

## 📋 AgentCall Method Parameters

The `agentCall` method accepts the following options:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phoneNumber` | string | Yes (for phone calls) | Phone number to call |
| `type` | string | No | Call type: 'phone' or 'web' (default: 'phone') |
| `webhookUrl` | string | No | URL for call event webhooks |
| `metadata` | object | No | Additional data to pass to the agent |

## 🔍 Call Management

### Check Call Status
```bash
curl http://localhost:3001/api/agent/call/YOUR_CALL_ID/status
```

### End a Call
```bash
curl -X POST http://localhost:3001/api/agent/call/YOUR_CALL_ID/end
```

### Get Agent Info
```bash
curl http://localhost:3001/api/agent/info
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   HTTP Client   │───▶│  AgentController │───▶│  VapiService    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   AgentRoutes    │    │   VAPI API     │
                       └──────────────────┘    └─────────────────┘
```

## 🚨 Error Handling

The service includes comprehensive error handling:

- **Validation Errors**: Missing required parameters
- **VAPI Errors**: API key issues, agent not found, etc.
- **Network Errors**: Connection issues, timeouts
- **Server Errors**: Internal processing errors

All errors return structured JSON responses with appropriate HTTP status codes.

## 🔐 Security Considerations

- Store VAPI API keys in environment variables (never in code)
- Use HTTPS in production
- Implement rate limiting for production use
- Validate all input parameters
- Log sensitive operations for audit trails

## 🧪 Testing

Test the endpoints using the provided curl commands or tools like Postman. The service includes a health check endpoint at `/health` to verify the server is running.

## 📚 Additional Resources

- [VAPI Documentation](https://docs.vapi.ai/)
- [VAPI Node.js SDK](https://www.npmjs.com/package/@vapi-ai/node)
- [Express.js Documentation](https://expressjs.com/)

## 🆘 Troubleshooting

**Common Issues:**

1. **"VAPI Agent ID not configured"**: Check your `.env` file
2. **"VAPI client not initialized"**: Verify your API key is correct
3. **"Phone number is required"**: Ensure phoneNumber is provided for phone calls
4. **Port already in use**: Change the PORT in your `.env` file

**Debug Mode:**
Set `NODE_ENV=development` in your `.env` file for detailed error messages. 