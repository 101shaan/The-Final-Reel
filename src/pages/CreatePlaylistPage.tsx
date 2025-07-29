import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Star, Users } from 'lucide-react';
import { usePlaylists } from '../hooks/usePlaylists';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { ImageUpload } from '../components/ui/ImageUpload';
import toast from 'react-hot-toast';

export const CreatePlaylistPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPlaylist, isAdmin } = usePlaylists();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);

  // Redirect if not admin
  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-8">
          Only admin users can create playlists.
        </p>
        <Button onClick={() => navigate('/playlists')}>Back to Playlists</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a playlist title');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await createPlaylist(
        formData.title,
        formData.description,
        formData.coverImage,
        formData.isFeatured
      );

      if (error) {
        toast.error('Failed to create playlist');
        console.error('Error creating playlist:', error);
        return;
      }

      toast.success(`${formData.isFeatured ? 'Featured playlist' : 'Playlist'} created successfully!`);
      navigate(`/playlist/${data.id}`);
    } catch (error) {
      toast.error('Failed to create playlist');
      console.error('Error creating playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      coverImage: imageUrl
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900"
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/playlists')}
              variant="secondary"
              size="sm"
              icon={ArrowLeft}
            >
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Create Playlist</h1>
              <p className="text-gray-400">Build a new movie collection</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                Playlist Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Enter playlist title..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                placeholder="Describe your playlist..."
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Cover Image
              </label>
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={formData.coverImage}
              />
              
              {/* Alternative URL input */}
              <div className="mt-4">
                <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-400 mb-2">
                  Or enter image URL
                </label>
                <input
                  type="url"
                  id="coverImageUrl"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="https://image.tmdb.org/t/p/w500/..."
                />
              </div>
            </div>

            {/* Featured Playlist Toggle */}
            <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="isFeatured" className="flex items-center space-x-2 text-white">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">Featured Playlist</span>
              </label>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Users className="w-3 h-3" />
                <span>Public & Featured</span>
              </div>
            </div>

            {formData.isFeatured && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">Featured Playlist</span>
                </div>
                <p className="text-sm text-yellow-300/80">
                  This playlist will be featured on the main playlists page and visible to all users.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/playlists')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                icon={Save}
                loading={loading}
                disabled={!formData.title.trim()}
              >
                Create Playlist
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}; 