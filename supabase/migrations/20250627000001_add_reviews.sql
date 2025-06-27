/*
  # Add Reviews System

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `movie_id` (integer)
      - `rating` (integer)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `is_approved` (boolean)

  2. Security
    - Enable RLS on reviews table
    - Add policies for authenticated users
*/

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  movie_id integer NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 10),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_approved boolean DEFAULT true,
  UNIQUE(user_id, movie_id)
);

-- Create indexes for reviews table
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews(movie_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved) WHERE is_approved = true;

-- Enable RLS on the reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Add updated_at trigger for reviews
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Reviews policies

-- Users can read approved reviews
CREATE POLICY "Users can view approved reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (is_approved = true);

-- Users can read their own reviews even if not approved
CREATE POLICY "Users can view their own reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create reviews for movies
CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.reviews TO authenticated; 