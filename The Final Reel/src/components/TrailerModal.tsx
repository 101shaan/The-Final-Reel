import React from 'react';
import { Modal } from './ui/Modal';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string;
  title?: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  videoKey,
  title = "Movie",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${title} - Trailer`}
      size="xl"
    >
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
          title={`${title} Trailer`}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media"
        />
      </div>
    </Modal>
  );
};