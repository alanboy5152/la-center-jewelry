import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { firestoreDb } from './firebase';
import { saveMediaBlob, getMediaUrl, removeMediaBlob } from './mediaStorage';

const CHUNK_SIZE = 650 * 1024; // 650KB per chunk (fits comfortably under Firestore 1MB doc limit)
const SETTINGS_COLLECTION = 'settings';
const VIDEO_META_DOC = 'hero_video_meta';

export interface CloudVideoMeta {
  fileName: string;
  fileSize: number;
  mimeType: string;
  totalChunks: number;
  updatedAt: string;
}

/**
 * Converts a File or Blob into Base64 string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const commaIdx = res.indexOf(',');
      resolve(commaIdx > -1 ? res.substring(commaIdx + 1) : res);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts Base64 string back to Blob
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

/**
 * Upload an admin-selected video file to Firestore in cloud chunks
 * Also saves to local IndexedDB for immediate local playback
 */
export async function uploadHeroVideoToCloud(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  // 1. Save to local IndexedDB for instantaneous local play
  const localBlobUrl = await saveMediaBlob('hero_video_desktop', file);
  localStorage.setItem('lac_hero_uploaded_filename', file.name);

  // 2. Read file as Base64
  const base64Data = await blobToBase64(file);
  const totalChunks = Math.ceil(base64Data.length / CHUNK_SIZE);

  // 3. Write metadata document to Firestore
  const meta: CloudVideoMeta = {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || 'video/mp4',
    totalChunks,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(firestoreDb, SETTINGS_COLLECTION, VIDEO_META_DOC), meta);

  // 4. Write chunks to Firestore
  for (let i = 0; i < totalChunks; i++) {
    const chunkData = base64Data.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    await setDoc(doc(firestoreDb, SETTINGS_COLLECTION, `hero_video_chunk_${i}`), {
      index: i,
      data: chunkData,
    });
    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalChunks) * 100));
    }
  }

  // 5. Store current meta timestamp in localStorage to know this browser is synced
  localStorage.setItem('lac_cached_hero_video_time', meta.updatedAt);

  return localBlobUrl;
}

/**
 * Retrieves the cloud hero video from Firestore or local cache
 * Works on ANY browser (Browser B, Vercel, mobile, Safari, Edge, etc.)
 */
export async function getHeroVideoFromCloudOrCache(): Promise<string | null> {
  try {
    // 1. Fetch metadata from Firestore
    const metaSnap = await getDoc(doc(firestoreDb, SETTINGS_COLLECTION, VIDEO_META_DOC));
    if (!metaSnap.exists()) {
      return null;
    }

    const meta = metaSnap.data() as CloudVideoMeta;
    if (!meta || !meta.totalChunks || meta.totalChunks <= 0) {
      return null;
    }

    // 2. Check if this browser already has this exact version cached in IndexedDB
    const cachedTime = localStorage.getItem('lac_cached_hero_video_time');
    if (cachedTime === meta.updatedAt) {
      const cachedUrl = await getMediaUrl('hero_video_desktop');
      if (cachedUrl) {
        return cachedUrl;
      }
    }

    // 3. Download chunks from Firestore and assemble
    let assembledBase64 = '';
    for (let i = 0; i < meta.totalChunks; i++) {
      const chunkSnap = await getDoc(doc(firestoreDb, SETTINGS_COLLECTION, `hero_video_chunk_${i}`));
      if (!chunkSnap.exists()) {
        console.warn(`Missing hero video chunk ${i}`);
        return null;
      }
      assembledBase64 += chunkSnap.data().data;
    }

    // 4. Convert to Blob
    const videoBlob = base64ToBlob(assembledBase64, meta.mimeType || 'video/mp4');

    // 5. Cache into this browser's IndexedDB so subsequent page opens are 0ms instant!
    const objectUrl = await saveMediaBlob('hero_video_desktop', videoBlob);
    localStorage.setItem('lac_cached_hero_video_time', meta.updatedAt);
    localStorage.setItem('lac_hero_uploaded_filename', meta.fileName);

    return objectUrl;
  } catch (err) {
    console.warn('Could not retrieve cloud hero video:', err);
    return null;
  }
}

/**
 * Remove cloud video from Firestore and local cache
 */
export async function removeHeroVideoFromCloud(): Promise<void> {
  try {
    const metaSnap = await getDoc(doc(firestoreDb, SETTINGS_COLLECTION, VIDEO_META_DOC));
    if (metaSnap.exists()) {
      const meta = metaSnap.data() as CloudVideoMeta;
      const total = meta.totalChunks || 0;
      await deleteDoc(doc(firestoreDb, SETTINGS_COLLECTION, VIDEO_META_DOC));
      for (let i = 0; i < total; i++) {
        await deleteDoc(doc(firestoreDb, SETTINGS_COLLECTION, `hero_video_chunk_${i}`));
      }
    }
    await removeMediaBlob('hero_video_desktop');
    localStorage.removeItem('lac_cached_hero_video_time');
    localStorage.removeItem('lac_hero_uploaded_filename');
  } catch (err) {
    console.warn('Failed to delete cloud video chunks:', err);
  }
}
