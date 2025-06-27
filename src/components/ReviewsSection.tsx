import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Edit, Trash2, X, Save, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useReviews, Review } from '../hooks/useReviews';

interface ReviewsSectionProps {
  movieId: number;
  className?: string;
}

const StarRating: React.FC<{
  rating: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ rating, onChange, interactive = false, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          type="button"
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={() => interactive && onChange && onChange(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          disabled={!interactive}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= (hoverRating || rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-500'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewItem: React.FC<{
  review: Review;
  currentUserId?: string;
  onDelete?: (id: string) => void;
}> = ({ review, currentUserId, onDelete }) => {
  const isOwner = currentUserId === review.user_id;
  const date = new Date(review.created_at);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            {review.user?.avatar_url ? (
              <img
                src={review.user.avatar_url}
                alt={review.user?.username || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <MessageSquare className="w-5 h-5 text-purple-400" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-white">{review.user?.username || 'Anonymous'}</h4>
            <div className="flex items-center mt-1">
              <StarRating rating={review.rating} size="sm" />
              <span className="ml-2 text-xs text-gray-400">
                {format(date, 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>
        
        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(review.id)}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
            aria-label="Delete review"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="mt-3 text-gray-300 leading-relaxed">
        {review.content}
      </div>
    </motion.div>
  );
};

const AddReviewForm: React.FC<{
  onSubmit: (rating: number, content: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  initialRating?: number;
  initialContent?: string;
}> = ({ onSubmit, onCancel, isSubmitting, initialRating = 0, initialContent = '' }) => {
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (content.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }
    
    onSubmit(rating, content);
  };
  
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm p-4"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Your Rating
        </label>
        <StarRating rating={rating} onChange={setRating} interactive size="lg" />
      </div>
      
      <div className="mb-4">
        <label htmlFor="review" className="block text-sm font-medium text-gray-300 mb-2">
          Your Review
        </label>
        <textarea
          id="review"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Share your thoughts about this movie..."
        />
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={isSubmitting}
          icon={Save}
        >
          Submit
        </Button>
      </div>
    </motion.form>
  );
};

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ movieId, className = '' }) => {
  const { user } = useAuth();
  const [showAddReview, setShowAddReview] = useState(false);
  
  const {
    reviews,
    userReview,
    averageRating,
    loadingReviews,
    isSubmitting,
    isDeleting,
    addReview,
    deleteReview,
    hasReviewed,
  } = useReviews(movieId);
  
  const handleAddReview = (rating: number, content: string) => {
    addReview(rating, content);
    setShowAddReview(false);
  };
  
  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      deleteReview(reviewId);
    }
  };
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Reviews</h2>
          <div className="flex items-center mt-2">
            {averageRating && (
              <>
                <StarRating rating={Math.round(averageRating.average)} />
                <span className="ml-2 text-yellow-400 font-medium">
                  {averageRating.average.toFixed(1)}
                </span>
                <span className="ml-1 text-gray-400">
                  ({averageRating.count} {averageRating.count === 1 ? 'review' : 'reviews'})
                </span>
              </>
            )}
            {!averageRating && <span className="text-gray-400">No reviews yet</span>}
          </div>
        </div>
        
        {user && !hasReviewed && !showAddReview && (
          <Button
            onClick={() => setShowAddReview(true)}
            variant="secondary"
            size="sm"
            icon={Edit}
          >
            Write a Review
          </Button>
        )}
        
        {user && hasReviewed && !showAddReview && (
          <Button
            onClick={() => setShowAddReview(true)}
            variant="ghost"
            size="sm"
            icon={Edit}
          >
            Edit Your Review
          </Button>
        )}
        
        {!user && (
          <div className="text-gray-400 text-sm">
            Sign in to leave a review
          </div>
        )}
      </div>
      
      {/* Add/Edit Review Form */}
      <AnimatePresence>
        {showAddReview && (
          <div className="mb-6">
            <AddReviewForm
              onSubmit={handleAddReview}
              onCancel={() => setShowAddReview(false)}
              isSubmitting={isSubmitting}
              initialRating={userReview?.rating || 0}
              initialContent={userReview?.content || ''}
            />
          </div>
        )}
      </AnimatePresence>
      
      {/* Reviews List */}
      <div className="space-y-4">
        {loadingReviews ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review: Review) => (
            <ReviewItem
              key={review.id}
              review={review}
              currentUserId={user?.id}
              onDelete={handleDeleteReview}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            No reviews yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}; 