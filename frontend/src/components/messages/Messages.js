import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import {
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const Messages = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchConversations();
    fetchPotentialRecipients();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPotentialRecipients = async () => {
    try {
      const response = await api.get('/users/message-recipients');
      setRecipients(response.data);
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await api.post(`/messages/conversations/${selectedConversation._id}`, {
        content: message
      });
      setMessage('');
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleStartNewConversation = async (e) => {
    e.preventDefault();
    try {
      await api.post('/messages/conversations', {
        recipient: selectedRecipient,
        subject: newMessageSubject,
        initialMessage: message
      });
      setShowNewMessageModal(false);
      setSelectedRecipient('');
      setNewMessageSubject('');
      setMessage('');
      fetchConversations();
    } catch (error) {
      console.error('Error starting conversation:', error);
      setError('Failed to start conversation. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchConversations}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-2 text-gray-600">Communicate with teachers, parents, and administrators</p>
      </div>

      <button
        onClick={() => setShowNewMessageModal(true)}
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
        New Message
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Conversations</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 text-left hover:bg-gray-50 ${
                  selectedConversation?._id === conv._id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center">
                  <UserCircleIcon className="h-6 w-6 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {conv.participants
                        .filter((p) => p._id !== user._id)
                        .map((p) => `${p.firstName} ${p.lastName}`)
                        .join(', ')}
                    </p>
                    <p className="text-sm text-gray-500">{conv.subject}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        {selectedConversation ? (
          <div className="md:col-span-2 bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">{selectedConversation.subject}</h2>
            </div>
            <div className="p-4 space-y-4 h-96 overflow-y-auto">
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md rounded-lg p-3 ${
                      msg.sender._id === user._id
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm font-medium">
                      {msg.sender._id === user._id ? 'You' : `${msg.sender.firstName} ${msg.sender.lastName}`}
                    </p>
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6 text-center">
            <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Choose a conversation from the list or start a new one.
            </p>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">New Message</h3>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleStartNewConversation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">To</label>
                <select
                  required
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select recipient</option>
                  {recipients.map((recipient) => (
                    <option key={recipient._id} value={recipient._id}>
                      {recipient.firstName} {recipient.lastName} ({recipient.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  required
                  value={newMessageSubject}
                  onChange={(e) => setNewMessageSubject(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewMessageModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages; 