const { processVoiceInput } = require('../ai/chains');

// @desc    Process voice input through the Voice Intelligence Layer
// @route   POST /api/ai/process-voice
// @access  Public (or Protected depending on requirements)
const processVoiceCommand = async (req, res) => {
    try {
        const { text, audio, mimeType } = req.body;

        if (!text && !audio) {
            return res.status(400).json({ success: false, message: "No text or audio input provided" });
        }

        console.log(`Processing voice input: ${audio ? 'Audio Blob' : text}`);

        const result = await processVoiceInput({ text, audio, mimeType });

        console.log("AI Response:", result);

        if (result.missing && result.workflow === 'unknown') {
            return res.status(200).json({
                success: true,
                data: result,
                message: "Could not identify a valid workflow."
            });
        }

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    processVoiceCommand
};
