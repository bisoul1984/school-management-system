const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Get all conversations for current user
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
    .populate('participants', 'firstName lastName email role')
    .sort({ lastMessage: -1 });

    // Get messages for each conversation
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv) => {
        const messages = await Message.find({ conversation: conv._id })
          .populate('sender', 'firstName lastName')
          .sort({ createdAt: 1 });
        
        return {
          ...conv.toObject(),
          messages
        };
      })
    );

    res.json(conversationsWithMessages);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

// Create new conversation
router.post('/conversations', protect, async (req, res) => {
  try {
    const { recipient, subject, initialMessage } = req.body;

    const conversation = new Conversation({
      participants: [req.user._id, recipient],
      subject
    });

    await conversation.save();

    const message = new Message({
      conversation: conversation._id,
      sender: req.user._id,
      content: initialMessage
    });

    await message.save();

    // Update conversation's lastMessage timestamp
    conversation.lastMessage = message.createdAt;
    await conversation.save();

    res.status(201).json({ conversation, message });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Error creating conversation' });
  }
});

// Add message to conversation
router.post('/conversations/:conversationId', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to message in this conversation' });
    }

    const message = new Message({
      conversation: conversation._id,
      sender: req.user._id,
      content
    });

    await message.save();

    // Update conversation's lastMessage timestamp
    conversation.lastMessage = message.createdAt;
    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router; 