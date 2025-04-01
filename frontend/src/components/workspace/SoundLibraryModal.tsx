import React, { useState } from 'react';
import Modal from '../shared/Modal';

interface SoundLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackSelect?: (trackName: string) => void; // Optional callback
}

const categories = ['Keyboard/Synth', 'Drums', 'Guitar', 'Bass', 'Other', 'Imported'];

const SoundLibraryModal: React.FC<SoundLibraryModalProps> = ({ isOpen, onClose, onTrackSelect }) => {
  const [mode, setMode] = useState<'category' | 'tracks'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [uploadedTracks, setUploadedTracks] = useState<string[]>([]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setMode('tracks');
    setSelectedTrack(null);
  };

  const handleBackToCategories = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTrack(null);
    setMode('category');
  };

  const handleUpload = () => {
    const name = prompt('Upload a track (enter track name):');
    if (name) {
      setUploadedTracks((prev) => [...prev, name]);
      setSelectedCategory('Imported');
      setMode('tracks');
    }
  };

  const handleSelectTrack = () => {
    if (selectedTrack) {
      console.log('Selected:', selectedTrack);
      if (onTrackSelect) onTrackSelect(selectedTrack);
      onClose();
    } else {
      alert('Please select a track first.');
    }
  };

  const getTracksForCategory = (category: string): string[] => {
    if (category === 'Imported') return uploadedTracks;
    return Array.from({ length: 12 }, (_, i) => `${category} Track ${i + 1}`);
  };

  if (!isOpen) return null;

  const filteredTracks = getTracksForCategory(selectedCategory || '').filter((track) =>
    track.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal onClose={onClose}>
      <div>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        {mode === 'category' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                style={{ padding: '2rem', fontWeight: 'bold' }}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={handleBackToCategories}>&larr; Back</button>
            <h3>{selectedCategory}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {Array.from({ length: 6 }).map((_, colIdx) => (
                <div
                  key={colIdx}
                  style={{
                    border: '1px solid #ccc',
                    padding: '0.5rem',
                    overflowY: 'auto',
                    maxHeight: '250px',
                  }}
                >
                  {filteredTracks.slice(colIdx * 6, colIdx * 6 + 6).map((trackName, i) => (
                    <div
                      key={`${colIdx}-${i}`}
                      onClick={() => setSelectedTrack(trackName)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem',
                        cursor: 'pointer',
                        background:
                          selectedTrack === trackName ? 'lightblue' : 'transparent',
                      }}
                    >
                      <span>{trackName}</span>
                      <span>🌊</span>
                      <button>▶</button>
                      <button>☆</button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.5rem' }}>
          <button style={{ background: '#1ccfcf' }} onClick={handleUpload}>
            Upload Track
          </button>
          <button style={{ background: '#1ccfcf' }} onClick={handleSelectTrack}>
            Select Track
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SoundLibraryModal;
