const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Event = require('../models/Event');

// Get all events
router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .populate('createdBy', 'firstName lastName');
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Create a new event
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, date, time, location, type } = req.body;
    
    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      type,
      createdBy: req.user._id
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Delete an event
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only allow the creator or admin to delete the event
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.remove();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

module.exports = router; 