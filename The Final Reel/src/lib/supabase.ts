import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Config:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY exists:', !!supabaseAnonKey);
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          avatar_url: string;
          bio: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string;
          avatar_url?: string;
          bio?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string;
          bio?: string;
          updated_at?: string;
        };
      };
      watchlist: {
        Row: {
          id: string;
          user_id: string;
          movie_id: number;
          movie_title: string;
          movie_poster: string;
          movie_backdrop: string;
          movie_rating: number;
          movie_year: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: number;
          movie_title: string;
          movie_poster?: string;
          movie_backdrop?: string;
          movie_rating?: number;
          movie_year?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          movie_id?: number;
          movie_title?: string;
          movie_poster?: string;
          movie_backdrop?: string;
          movie_rating?: number;
          movie_year?: number;
        };
      };
      playlists: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string;
          cover_image: string;
          is_public: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          description?: string;
          cover_image?: string;
          is_public?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          description?: string;
          cover_image?: string;
          is_public?: boolean;
          is_featured?: boolean;
          updated_at?: string;
        };
      };
      playlist_movies: {
        Row: {
          id: string;
          playlist_id: string;
          movie_id: number;
          movie_title: string;
          movie_poster: string;
          movie_backdrop: string;
          movie_rating: number;
          movie_year: number;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          playlist_id: string;
          movie_id: number;
          movie_title: string;
          movie_poster?: string;
          movie_backdrop?: string;
          movie_rating?: number;
          movie_year?: number;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          playlist_id?: string;
          movie_id?: number;
          movie_title?: string;
          movie_poster?: string;
          movie_backdrop?: string;
          movie_rating?: number;
          movie_year?: number;
          order_index?: number;
        };
      };
    };
  };
};