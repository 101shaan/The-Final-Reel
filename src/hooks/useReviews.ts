import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';
import { containsProfanity, filterProfanity } from '../lib/profanityFilter';

export interface Review {
  id: string;
  user_id: string;
  movie_id: number;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string;
  is_approved: boolean;
  user?: {
    username: string;
    avatar_url: string;
  };
}

export const useReviews = (movieId?: number) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Get all reviews for a movie (only approved ones, unless they belong to the current user)
  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ['reviews', movieId],
    queryFn: async () => {
      if (!movieId) return [];
      
      // Query to get all approved reviews for the movie
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*, profiles:user_id(username, avatar_url)')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      
      // Format the reviews with user information
      return reviews.map((review: any) => ({
        ...review,
        user: review.profiles
      }));
    },
    enabled: !!movieId,
  });

  // Get current user's review for this movie
  const { data: userReview, isLoading: loadingUserReview } = useQuery({
    queryKey: ['userReview', movieId, user?.id],
    queryFn: async () => {
      if (!movieId || !user) return null;
      
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('movie_id', movieId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user review:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!movieId && !!user,
  });

  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: async ({ rating, content }: { rating: number; content: string }) => {
      if (!user || !movieId) throw new Error('User must be logged in to review');
      
      // Check for profanity in content
      if (containsProfanity(content)) {
        throw new Error('Your review contains inappropriate language. Please revise it.');
      }

      // If there's an existing review, update it
      if (userReview) {
        const { data, error } = await supabase
          .from('reviews')
          .update({ rating, content, updated_at: new Date().toISOString() })
          .eq('id', userReview.id)
          .select();
          
        if (error) throw error;
        return data;
      }
      
      // Otherwise, insert a new review
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          movie_id: movieId,
          rating,
          content,
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ['reviews', movieId] });
      queryClient.invalidateQueries({ queryKey: ['userReview', movieId, user?.id] });
      toast.success('Review submitted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setError(error.message);
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      if (!user) throw new Error('User must be logged in to delete a review');
      
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', movieId] });
      queryClient.invalidateQueries({ queryKey: ['userReview', movieId, user?.id] });
      toast.success('Review deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete review');
      setError(error.message);
    },
  });

  // Get average rating for a movie
  const { data: averageRating } = useQuery({
    queryKey: ['averageRating', movieId],
    queryFn: async () => {
      if (!movieId) return null;
      
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('movie_id', movieId)
        .eq('is_approved', true);
      
      if (error) {
        console.error('Error fetching average rating:', error);
        throw error;
      }
      
      if (data.length === 0) return null;
      
      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      return {
        average: sum / data.length,
        count: data.length,
      };
    },
    enabled: !!movieId,
  });

  // Add a review
  const addReview = (rating: number, content: string) => {
    addReviewMutation.mutate({ rating, content });
  };
  
  // Delete a review
  const deleteReview = (reviewId: string) => {
    deleteReviewMutation.mutate(reviewId);
  };

  // Check if user has already reviewed
  const hasReviewed = !!userReview;

  return {
    reviews,
    userReview,
    averageRating,
    loadingReviews,
    loadingUserReview,
    isSubmitting: addReviewMutation.isPending,
    isDeleting: deleteReviewMutation.isPending,
    error,
    addReview,
    deleteReview,
    hasReviewed,
  };
}; 