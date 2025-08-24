import { readFileSync } from 'fs';

// Test the fallback system directly
async function testFallbackSystem() {
    console.log('=== Testing Fallback System ===\n');

    try {
        // Load fallback data directly
        const fallbackJson = readFileSync('fallback-data.json', 'utf-8');
        const fallbackData = JSON.parse(fallbackJson);

        console.log(`Loaded ${fallbackData.fallbackResponses.length} fallback responses\n`);

        console.log('Sample fallback responses:\n');

        // Show first 5 fallback responses
        for (let i = 0; i < Math.min(5, fallbackData.fallbackResponses.length); i++) {
            const response = fallbackData.fallbackResponses[i];
            console.log(`${i + 1}. ${response.serviceType}:`);
            console.log(`   Units: ${response.units}`);
            console.log(`   Billed Amount: $${response.billedAmount}`);
            console.log(`   Typical Cost: $${response.typicalCost.min} - $${response.typicalCost.median} - $${response.typicalCost.max}`);
            console.log('');
        }

        console.log('Testing random selection:\n');

        // Generate 3 random selections
        for (let i = 1; i <= 3; i++) {
            const randomIndex = Math.floor(Math.random() * fallbackData.fallbackResponses.length);
            const randomResponse = fallbackData.fallbackResponses[randomIndex];
            console.log(`${i}. Random Selection (${randomResponse.serviceType}):`);
            console.log(`   Units: ${randomResponse.units}`);
            console.log(`   Billed Amount: $${randomResponse.billedAmount}`);
            console.log(`   Typical Cost: $${randomResponse.typicalCost.min} - $${randomResponse.typicalCost.median} - $${randomResponse.typicalCost.max}`);
            console.log('');
        }

    } catch (error) {
        console.error('Error testing fallback system:', error);
    }
}

// Run the test
testFallbackSystem()
    .then(() => console.log('✅ Fallback system test completed'))
    .catch(error => console.error('❌ Fallback system test failed:', error));
