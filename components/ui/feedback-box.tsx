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
      <div>
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
       
        aria-label="Give Feedback"
      >
        <MessageSquare size={24} />
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div>
          <div>
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
    <form onSubmit={onSubmit}>
      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
         
          aria-label="Close"
        >
          <X size={24} />
        </button>
      )}

      <h3>
        {isSuccess ? 'Thank You!' : 'Share Your Feedback'}
      </h3>
      
      {isSuccess ? (
        <div>
          <CheckCircle />
          <p>
            Your feedback has been received. We appreciate your input!
          </p>
        </div>
      ) : (
        <>
          <p>
            Help us improve Paint Quote Pro with your valuable feedback.
          </p>

          {/* Star Rating */}
          <div>
            <label>
              How would you rate your experience?
            </label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                 
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={32}
                   
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Message */}
          <div>
            <label htmlFor="feedback-message">
              Your Feedback <span>*</span>
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
             
              placeholder="Tell us what you think..."
              required
            />
          </div>

          {/* Name (Optional) */}
          <div>
            <label htmlFor="feedback-name">
              Name (Optional)
            </label>
            <input
              id="feedback-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
             
              placeholder="John Doe"
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label htmlFor="feedback-email">
              Email (Optional)
            </label>
            <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
             
              placeholder="john@example.com"
            />
            <p>
              If you'd like us to follow up with you
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
           
          >
            {isSubmitting ? (
              <>
                <div />
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