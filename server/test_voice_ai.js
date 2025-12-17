
async function testVoiceAI() {
    const testCases = [
        {
            text: "There is a deep pothole on Main Street causing traffic."
        },
        {
            text: "Open my reports please"
        },
        {
            text: "Status update for issue 12345. I have filled the pothole and it is now safe."
        }
    ];

    for (const test of testCases) {
        console.log(`\nSending: "${test.text}"`);
        try {
            const response = await fetch('http://localhost:5001/api/ai/process-voice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: test.text })
            });

            if (!response.ok) {
                console.error(`Status: ${response.status} ${response.statusText}`);
                const text = await response.text();
                console.error("Response Body:", text);
                continue;
            }

            const data = await response.json();
            console.log("Response:", JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Test Error:", error.message);
            // If it was a parsing error, it might be in the response body
        }
    }
}

testVoiceAI();
