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
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      
      // If user is authenticated, also fetch their unapproved reviews for this movie
      if (user) {
        const { data: userReviews, error: userError } = await supabase
          .from('reviews')
          .select('*, profiles:user_id(username, avatar_url)')
          .eq('movie_id', movieId)
          .eq('user_id', user.id)
          .eq('is_approved', false);
          
        if (userError) {
          console.error('Error fetching user reviews:', userError);
        } else if (userReviews) {
          reviews.push(...userReviews);
        }
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
      console.log('Adding review:', { rating, content, movieId, userId: user?.id });
      
      if (!user || !movieId) throw new Error('User must be logged in to review');
      
      // Check for profanity in content
      if (containsProfanity(content)) {
        throw new Error('Your review contains inappropriate language. Please revise it.');
      }

      // Check if reviews table exists and debug permissions
      const { data: tableCheck, error: tableError } = await supabase
        .from('reviews')
        .select('id')
        .limit(1)
        .single();

      if (tableError && tableError.code !== 'PGRST116') { // PGRST116 is "Results contain 0 rows"
        console.error('Table check error:', {
          message: tableError.message,
          details: tableError.details,
          hint: tableError.hint,
          code: tableError.code
        });
        throw new Error(`Database error: ${tableError.message} (${tableError.code})`);
      }

      console.log('Table check result:', tableCheck);

      try {
        // If there's an existing review, update it
        if (userReview) {
          console.log('Updating existing review:', userReview.id);
          
          const { data, error } = await supabase
            .from('reviews')
            .update({ 
              rating, 
              content, 
              updated_at: new Date().toISOString() 
            })
            .eq('id', userReview.id)
            .select();
            
          if (error) {
            console.error('Update error details:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            throw new Error(`Failed to update review: ${error.message} (${error.code})`);
          }
          
          console.log('Review updated successfully:', data);
          return data;
        }
        
        // Otherwise, insert a new review
        console.log('Creating new review with data:', {
          user_id: user.id,
          movie_id: movieId,
          rating,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_approved: true
        });
        
        const { data, error } = await supabase
          .from('reviews')
          .insert({
            user_id: user.id,
            movie_id: movieId,
            rating,
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_approved: true
          })
          .select();
        
        if (error) {
          console.error('Insert error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw new Error(`Failed to create review: ${error.message} (${error.code})`);
        }
        
        console.log('Review created successfully:', data);
        return data;
      } catch (error: any) {
        console.error('Review mutation failed:', error);
        // If it's a Supabase error, it will have a code property
        if (error.code) {
          throw new Error(`Database error (${error.code}): ${error.message}`);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', movieId] });
      queryClient.invalidateQueries({ queryKey: ['userReview', movieId, user?.id] });
      toast.success('Review submitted successfully!');
      setError(null);
    },
    onError: (error: Error) => {
      console.error('Review submission error:', error);
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
      setError(null);
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