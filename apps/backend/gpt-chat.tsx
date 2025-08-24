import { config } from 'dotenv';

// Load environment variables
config();

interface ChatResponse {
    content: string;
    model: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

class GPTChatService {
    private apiKey: string;
    private defaultModel: string;

    constructor(apiKey?: string, defaultModel: string = 'gpt-5-nano') {
        const key = apiKey || process.env.OPENAI_API_KEY;

        if (!key) {
            throw new Error('OpenAI API key is required. Set OPENAI_API_KEY in .env file or pass it as parameter.');
        }

        this.apiKey = key;
        this.defaultModel = defaultModel;
    }

    /**
 * Send a prompt to GPT and get a text response using direct fetch
 */
    async chat(
        prompt: string,
        model?: string,
        systemPrompt?: string,
        temperature: number = 1.0
    ): Promise<ChatResponse> {
        const modelToUse = model || this.defaultModel;

        try {
            const messages: any[] = [];

            // Add system message if provided
            if (systemPrompt) {
                messages.push({
                    role: 'system',
                    content: systemPrompt
                });
            }

            // Add user message
            messages.push({
                role: 'user',
                content: prompt
            });

            console.log(`Sending request to ${modelToUse} using direct fetch...`);
            console.log(`Using API key: ${this.apiKey.substring(0, 20)}...${this.apiKey.slice(-4)}`);

            const requestBody: any = {
                model: modelToUse,
                messages: messages,
                max_completion_tokens: 4000,
            };

            // Only add temperature if it's not the default (1.0)
            if (temperature !== 1.0) {
                requestBody.temperature = temperature;
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${response.status} ${response.statusText}. Response: ${errorText}`);
            }

            const completion = await response.json();
            const responseContent = completion.choices[0]?.message?.content;

            if (!responseContent) {
                throw new Error('No response received from OpenAI');
            }

            return {
                content: responseContent,
                model: modelToUse,
                usage: completion.usage ? {
                    prompt_tokens: completion.usage.prompt_tokens,
                    completion_tokens: completion.usage.completion_tokens,
                    total_tokens: completion.usage.total_tokens
                } : undefined
            };

        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            throw error;
        }
    }

    /**
     * Set a new default model
     */
    setDefaultModel(model: string): void {
        this.defaultModel = model;
        console.log(`Default model changed to: ${model}`);
    }

    /**
     * Get the current default model
     */
    getDefaultModel(): string {
        return this.defaultModel;
    }
}

// Example usage function
async function testGPTChat() {
    try {
        // Initialize the service (will read OPENAI_API_KEY from .env)
        const gptService = new GPTChatService();

        console.log(`Using model: ${gptService.getDefaultModel()}`);
        console.log('--- Testing GPT Chat ---\n');

        // Test prompt
        const prompt = "Explain what a medical audit is in simple terms.";

        console.log(`Prompt: ${prompt}\n`);

        // Get response
        const response = await gptService.chat(prompt);

        console.log('=== GPT RESPONSE ===');
        console.log(response.content);
        console.log('\n=== METADATA ===');
        console.log(`Model used: ${response.model}`);
        if (response.usage) {
            console.log(`Tokens used: ${response.usage.total_tokens} (${response.usage.prompt_tokens} prompt + ${response.usage.completion_tokens} completion)`);
        }

        return response;

    } catch (error) {
        console.error('Failed to test GPT chat:', error);
        throw error;
    }
}

export { GPTChatService, testGPTChat };

// Run the test function only if this file is executed directly (not imported)
if (require.main === module) {
    testGPTChat()
        .then(() => console.log('\nTest completed successfully'))
        .catch(error => console.error('Test failed:', error));
}
