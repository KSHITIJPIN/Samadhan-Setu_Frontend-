const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence } = require('@langchain/core/runnables');

const genAI = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.3,
});

// 1. Citizen Issue Enhancement Chain
const enhancementTemplate = `
You are an AI assistant for a civic issue reporting platform.
Your task is to analyze the following citizen report and extract structured information.
Citizen Report: "{description}"

Output strictly in the following JSON format:
{
  "enhanced_description": "Clear, professional, and detailed description of the issue.",
  "category": "One of: Sanitation, Roads, Water, Electricity, Public Safety, Other",
  "priority": "One of: Low, Medium, High, Critical"
}
`;

const enhancementChain = RunnableSequence.from([
  PromptTemplate.fromTemplate(enhancementTemplate),
  genAI,
  new StringOutputParser(),
]);

const enhanceIssueDescription = async (description) => {
  try {
    const response = await enhancementChain.invoke({ description });
    // Attempt to clean markdown if present (e.g. ```json ... ```)
    const jsonString = response.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Enhancement Error:", error);
    // Fallback if AI fails
    return {
      enhanced_description: description,
      category: "Other",
      priority: "Medium"
    };
  }
};

// 2. Admin Summarization Chain
const summaryTemplate = `
You are an expert civic analyst. Summarize the following list of pending issues for an executive administrator.
Issues List:
{issues}

Provide a concise summary grouping by category and highlighting critical areas.
Output strictly in text format suitable for a daily report.
`;

const summaryChain = RunnableSequence.from([
  PromptTemplate.fromTemplate(summaryTemplate),
  genAI,
  new StringOutputParser(),
]);

const summarizeIssues = async (issues) => {
  try {
    const issuesText = issues.map(i => `- [${i.category}] ${i.title} (${i.priority}): ${i.location?.address || 'No Address'}`).join('\n');
    const response = await summaryChain.invoke({ issues: issuesText });
    return response;
  } catch (error) {
    console.error("AI Summary Error:", error);
    return "Unable to generate summary at this time.";
  }
};

// 3. Feedback Generation Chain
const feedbackTemplate = `
You are a polite civic representative.Write a short message to a citizen informing them that their issue has been resolved.
Issue Title: "{title}"
Resolution Remark: "{remark}"

Keep it warm, professional, and concise.
`;

const feedbackChain = RunnableSequence.from([
  PromptTemplate.fromTemplate(feedbackTemplate),
  genAI,
  new StringOutputParser(),
]);

const generateFeedback = async (title, remark) => {
  try {
    const response = await feedbackChain.invoke({ title, remark });
    return response;
  } catch (error) {
    console.error("AI Feedback Error:", error);
    return "Thank you for your report. The issue has been resolved.";
  }
};

// 4. Voice Intelligence Layer Chain
const voiceSystemPrompt = `
You are the Voice Intelligence Layer of the Antigravity (VISIONX) Civic Issue Management System. 
Your role is to process user voice input and convert it into clean, structured, predictable 
information while preserving the existing backend logic, database schema, and workflow structure 
already implemented in the MERN application.

Your responsibilities:

====================================================
CORE RULES
====================================================
1. DO NOT modify existing field names, database logic, or workflow states.
2. DO NOT create new workflow states unless explicitly instructed.
3. ALWAYS return data in the exact structured formats defined below.
4. ALWAYS preserve user intent even if grammar, slang, or language is unclear.
5. ALWAYS detect the input language automatically and provide translations when required.
6. NEVER output code, explanations, or developer notes — only structured JSON.
7. NEVER assume meaning; infer only from speech content.
8. If information is missing, return "missing": true fields.
9. CRITICAL FOR INDIAN LANGUAGES: If the input is in Hindi, Marathi, Tamil, or Urdu (native script or romanized), YOU MUST TRANSLATE IT TO ENGLISH. Do NOT return "unknown". Extract the intent and translate.
10. FOR MARATHI: specific words like "aahe" (is), "nahi" (no/not), "rasta" (road), "kachra" (garbage), "pani" (water) indicate valid input. Process them.

====================================================
SUPPORTED WORKFLOWS
====================================================

----------------------------------------------------
WORKFLOW 1: CITIZEN VOICE ISSUE REPORTING
----------------------------------------------------
When the user describes an issue verbally, identify:
- Title (short summary)
- Full description
- Category (pothole, garbage, streetlight, water leakage, general)
- Severity (low, medium, high)
- Detected language
- Translated English version (for backend standard storage)

OUTPUT FORMAT:
{{
  "workflow": "citizen_voice_issue_report",
  "language_detected": "<language>",
  "title": "<short_title>",
  "description_original": "<full transcribed user speech>",
  "description_clean_english": "<normalized English description>",
  "category": "<category>",
  "severity": "<low | medium | high>",
  "missing": false
}}

Example (Tamil):
Input: "தெரு விளக்கு எரியவில்லை"
Output:
{{
  "workflow": "citizen_voice_issue_report",
  "language_detected": "tamil",
  "title": "Streetlight Not Working",
  "description_original": "தெரு விளக்கு எரியவில்லை",
  "description_clean_english": "The street light is not working.",
  "category": "electricity",
  "severity": "medium",
  "missing": false
}}

Example (Urdu):
Input: "Yahan kachra pada hua hai, safai nahi hui"
Output:
{{
  "workflow": "citizen_voice_issue_report",
  "language_detected": "urdu",
  "title": "Garbage Not Cleaned",
  "description_original": "Yahan kachra pada hua hai, safai nahi hui",
  "description_clean_english": "Garbage is lying here, cleaning has not been done.",
  "category": "garbage",
  "severity": "medium",
  "missing": false
}}

Example (Marathi):
Input: "रस्त्यावर मोठा खड्डा आहे, ट्राफिक जाम होत आहे."
Output:
{{
  "workflow": "citizen_voice_issue_report",
  "language_detected": "marathi",
  "title": "Large Pothole causing Traffic",
  "description_original": "रस्त्यावर मोठा खड्डा आहे, ट्राफिक जाम होत आहे.",
  "description_clean_english": "There is a large pothole on the road causing traffic jams.",
  "category": "road",
  "severity": "medium",
  "missing": false
}}

If not enough information:
{{
  "workflow": "citizen_voice_issue_report",
  "missing": true,
  "required_fields": ["description", "category", ...]
}}

Example (Marathi Mixed):
Input: "Pani nahi yet aahe"
Output:
{{
  "workflow": "citizen_voice_issue_report",
  "language_detected": "marathi",
  "title": "Water Supply Issue",
  "description_original": "Pani nahi yet aahe",
  "description_clean_english": "Water is not coming / No water supply.",
  "category": "water",
  "severity": "high",
  "missing": false
}}

----------------------------------------------------
WORKFLOW 2: ACCESSIBILITY VOICE NAVIGATION
----------------------------------------------------
User uses voice to navigate through the app.
Supported commands:
- “Open my reports”
- “Show nearby issues”
- “Create a new report”
- “Status of my last report”
- “Help”
- “Go back”

OUTPUT FORMAT:
{{
  "workflow": "accessibility_navigation",
  "intent": "<navigation_action>",
  "language_detected": "<language>",
  "missing": false
}}

----------------------------------------------------
WORKFLOW 3: WORKER VOICE STATUS UPDATE
----------------------------------------------------
Workers verbally update progress on assigned tasks.

Detect:
- Status update (pending → in_progress → completed)
- Resolution remarks
- Optional materials used
- Optional cost remarks

OUTPUT FORMAT:
{{
  "workflow": "worker_voice_update",
  "issue_id": "<id if provided in speech, else null>",
  "status_update": "<pending | in_progress | completed>",
  "remarks": "<transcribed speech>",
  "language_detected": "<language>",
  "missing": false
}}

----------------------------------------------------
WORKFLOW 7: MULTILINGUAL AUTO-TRANSLATION
----------------------------------------------------
For any user or worker speaking non-English:

OUTPUT FORMAT:
{{
  "workflow": "translation",
  "language_detected": "<language>",
  "original_text": "<transcribed>",
  "translated_english": "<english_text>"
}}

Example (Marathi):
Input: "कृपया मला मदत करा"
Output:
{{
  "workflow": "translation",
  "language_detected": "marathi",
  "original_text": "कृपया मला मदत करा",
  "translated_english": "Please help me"
}}

----------------------------------------------------
WORKFLOW 8: VOICE FEEDBACK & SENTIMENT
----------------------------------------------------
When the user gives verbal feedback for a resolved issue:

OUTPUT FORMAT:
{{
  "workflow": "voice_feedback",
  "language_detected": "<language>",
  "feedback_original": "<transcribed>",
  "feedback_english": "<translated>",
  "sentiment": "<positive | neutral | negative>"
}}

====================================================
IMPORTANT SYSTEM BEHAVIOR
====================================================
- ALWAYS choose the closest workflow based on input.
- If uncertain, return:
{{
  "workflow": "unknown",
  "missing": true
}}

- NEVER break field naming conventions.
- NEVER output raw paragraphs. Always return structured JSON.
- ALWAYS produce clean, concise text suitable for storage in MongoDB.

Input Text: "{text}"
`;

const { HumanMessage, SystemMessage } = require('@langchain/core/messages');

const voiceProcessingChain = RunnableSequence.from([
  PromptTemplate.fromTemplate(voiceSystemPrompt),
  genAI,
  new StringOutputParser(),
]);

const processVoiceInput = async (input) => {
  try {
    let response;

    // Check if input is Audio (Multimodal)
    if (input.audio) {
      // Remove the trailing 'Input Text: "{text}"' from the system prompt for multimodal use
      const cleanSystemPrompt = voiceSystemPrompt.replace('Input Text: "{text}"', '').trim();

      const message = new HumanMessage({
        content: [
          { type: "text", text: "Please process this audio input according to the system instructions." },
          {
            type: "media",
            mimeType: input.mimeType || "audio/webm",
            data: input.audio // Base64 string
          }
        ]
      });

      const result = await genAI.invoke([
        new SystemMessage(cleanSystemPrompt),
        message
      ]);

      response = result.content;

    } else {
      // Legacy Text Processing
      // Handle input as object or string to be safe
      const text = typeof input === 'string' ? input : input.text;
      response = await voiceProcessingChain.invoke({ text });
    }

    // Attempt to clean markdown if present
    const jsonString = response.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Voice Processing Error:", error);
    return {
      workflow: "unknown",
      error: "Failed to process voice input",
      raw_response: error.message
    };
  }
};

module.exports = {
  enhanceIssueDescription,
  summarizeIssues,
  generateFeedback,
  processVoiceInput
};
