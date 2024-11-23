// src/components/FolderView.tsx
'use client';

import React, { useState } from 'react';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import SimpleModal from './SimpleModal';

type BatchJSON = Record<
  string, // Client name (lastName, firstName)
  Record<string, string> // File name as key and share link as value
>;

const FolderView: React.FC = () => {
  const { files, folderContents, fetchFolderContents, loading, error } = useGoogleDrive();
  const [selectedFiles, setSelectedFiles] = useState<{ id: string; name: string }[]>([]);
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleFolderClick = async (folderId: string) => {
    await fetchFolderContents(folderId);
    setIsModalOpen(true); // Open modal for folder contents
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addToBatch = (file: { id: string; name: string }) => {
    setSelectedFiles((prev) => [...prev, file]);
  };

  const generateJSON = () => {
    const grouped: BatchJSON = selectedFiles.reduce((acc: BatchJSON, file) => {
      const [lastName, firstName] = file.name.split('_') || ['Unknown', 'Unknown'];
      const key = `${lastName}, ${firstName}`;
      if (!acc[key]) acc[key] = {};
      acc[key][file.name] = `https://drive.google.com/file/d/${file.id}/view`;
      return acc;
    }, {});

    setJsonOutput(JSON.stringify(grouped, null, 2));
  };

  if (loading) return <p className="text-black mb-3">Loading...</p>;
  if (error) return <p className="text-black mb-3">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3 text-fuchsia-800">Google Drive Viewer</h1>
      <div>
        {files.map((file) => (
          <div key={file.id} onClick={() => handleFolderClick(file.id)} style={{ cursor: 'pointer' }}>
            <p className="text-black mb-3">{file.name}</p>
          </div>
        ))}
      </div>

      <SimpleModal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className='text-black'>Folder Contents</h2>
        {folderContents.length > 0 ? (
          folderContents.map((item) => (
            <div
              key={item.id}
              onClick={() => addToBatch(item)}
              style={{ cursor: 'pointer', margin: '5px 0' }}
            >
              <p className="text-black mb-3">{item.name}</p>
            </div>
          ))
        ) : (
          <p className="text-black mb-3">No contents found in this folder.</p>
        )}
      </SimpleModal>

      <button className='bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded' onClick={generateJSON}>Generate JSON</button>

      {jsonOutput && (
        <div>
          <h3>Generated JSON</h3>
          <pre>{jsonOutput}</pre>
        </div>
      )}
    </div>
  );
};

export default FolderView;