import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Config:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Helper function to check if a table exists and has the expected structure
export const checkTableStructure = async (tableName: string) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Results contain 0 rows"
      console.error(`Error checking ${tableName} table:`, {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { hasData: false, error };
    }

    return { hasData: !!data };
  } catch (error) {
    console.error(`Error checking ${tableName} table:`, error);
    return { hasData: false, error };
  }
};

// Check reviews table on init
checkTableStructure('reviews').then(result => {
  console.log('Reviews table exists:', result);
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
      reviews: {
        Row: {
          id: string;
          user_id: string;
          movie_id: number;
          rating: number;
          content: string;
          created_at: string;
          updated_at: string;
          is_approved: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: number;
          rating: number;
          content: string;
          created_at?: string;
          updated_at?: string;
          is_approved?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          movie_id?: number;
          rating?: number;
          content?: string;
          updated_at?: string;
          is_approved?: boolean;
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