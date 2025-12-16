const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const feedback = await Feedback.create({
            userId: req.user.id,
            subject,
            message
        });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};

exports.getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
};
