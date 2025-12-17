require('dotenv').config();
const { processVoiceInput } = require('./ai/chains');

const tests = [
    { lang: 'hi', text: "सड़क पर बहुत बड़ा गड्ढा है और पानी भरा हुआ है" },
    { lang: 'mr', text: "आमच्या भागात कचरा उचलला जात नाही, खूप दुर्गंधी येत आहे." },
    { lang: 'mr_short', text: "पाणी नाही" },
    { lang: 'mr_mixed', text: "Rasta kharab aahe" },
    { lang: 'ta', text: "தெரு விளக்கு எரியவில்லை" },
    { lang: 'ur', text: "Yahan light nahi jal rahi hai wo toot gayi hai" }
];

async function runTests() {
    console.log("Testing Multilingual Support...\n");

    for (const test of tests) {
        if (test.lang === 'hi') console.log("--- Testing Hindi ---");
        if (test.lang === 'mr') console.log("--- Testing Marathi (Detailed) ---");
        if (test.lang === 'mr_short') console.log("--- Testing Marathi (Short) ---");
        if (test.lang === 'mr_mixed') console.log("--- Testing Marathi (Mixed) ---");
        if (test.lang === 'ta') console.log("--- Testing Tamil ---");
        if (test.lang === 'ur') console.log("--- Testing Urdu ---");

        console.log(`Input: ${test.text}`);
        const result = await processVoiceInput(test.text);
        console.log("Result:", JSON.stringify(result, null, 2));
        console.log("\n");
    }
}

runTests();
