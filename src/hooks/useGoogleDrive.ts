import { useState, useEffect } from 'react';

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
}

export function useGoogleDrive() {
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [folderContents, setFolderContents] = useState<GoogleDriveFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/drive/list`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch files');
      setFiles(data);
    } catch {
      setError('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const fetchFolderContents = async (folderId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/drive/list?folderId=${folderId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch folder contents');
      setFolderContents(data);
    } catch {
      setError('Failed to fetch folder contents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return { files, folderContents, fetchFolderContents, loading, error };
}