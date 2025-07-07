'use client';

import React, { useState } from 'react';
import { MessageSquare, Star, Send, CheckCircle, X } from 'lucide-react';

interface FeedbackBoxProps {
  type: 'app' | 'website';
  position?: 'fixed' | 'inline';
  page?: string;
}

export function FeedbackBox({ type, position = 'fixed', page }: FeedbackBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim(),
          name: name.trim(),
          type,
          page: page || window.location.pathname,
          rating: rating || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          // Reset form after closing
          setTimeout(() => {
            setMessage('');
            setEmail('');
            setName('');
            setRating(0);
            setIsSuccess(false);
          }, 300);
        }, 2000);
      } else {
        setError(data.error || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (position === 'inline') {
    return (
      <div className="w-full max-w-md mx-auto">
        <FeedbackForm
          rating={rating}
          setRating={setRating}
          message={message}
          setMessage={setMessage}
          email={email}
          setEmail={setEmail}
          name={name}
          setName={setName}
          isSubmitting={isSubmitting}
          isSuccess={isSuccess}
          error={error}
          onSubmit={handleSubmit}
          onClose={() => {}}
          showCloseButton={false}
        />
      </div>
    );
  }

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-all hover:scale-110 z-30"
        aria-label="Give Feedback"
      >
        <MessageSquare size={24} />
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <FeedbackForm
              rating={rating}
              setRating={setRating}
              message={message}
              setMessage={setMessage}
              email={email}
              setEmail={setEmail}
              name={name}
              setName={setName}
              isSubmitting={isSubmitting}
              isSuccess={isSuccess}
              error={error}
              onSubmit={handleSubmit}
              onClose={() => setIsOpen(false)}
              showCloseButton={true}
            />
          </div>
        </div>
      )}
    </>
  );
}

function FeedbackForm({
  rating,
  setRating,
  message,
  setMessage,
  email,
  setEmail,
  name,
  setName,
  isSubmitting,
  isSuccess,
  error,
  onSubmit,
  onClose,
  showCloseButton = true,
}: any) {
  return (
    <form onSubmit={onSubmit} className="p-6">
      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      )}

      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {isSuccess ? 'Thank You!' : 'Share Your Feedback'}
      </h3>
      
      {isSuccess ? (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">
            Your feedback has been received. We appreciate your input!
          </p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-6">
            Help us improve Paint Quote Pro with your valuable feedback.
          </p>

          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-all hover:scale-110"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={32}
                    className={
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-400'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Message */}
          <div className="mb-4">
            <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              placeholder="Tell us what you think..."
              required
            />
          </div>

          {/* Name (Optional) */}
          <div className="mb-4">
            <label htmlFor="feedback-name" className="block text-sm font-medium text-gray-700 mb-2">
              Name (Optional)
            </label>
            <input
              id="feedback-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="John Doe"
            />
          </div>

          {/* Email (Optional) */}
          <div className="mb-6">
            <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-700 mb-2">
              Email (Optional)
            </label>
            <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="john@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              If you'd like us to follow up with you
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Feedback
              </>
            )}
          </button>
        </>
      )}
    </form>
  );
}