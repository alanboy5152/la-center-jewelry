// Local IndexedDB media storage for large video and asset uploads
// Ensures uploaded videos persist reliably across browser reloads and sessions

const DB_NAME = 'la_center_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a video/image Blob into IndexedDB
 */
export async function saveMediaBlob(key: string, blob: Blob): Promise<string> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('Failed to save media to IndexedDB, falling back to ephemeral URL', err);
    return URL.createObjectURL(blob);
  }
}

/**
 * Retrieve a stored media Blob and create an ObjectURL
 */
export async function getMediaUrl(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    const blob = await new Promise<Blob | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });

    if (blob) {
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (err) {
    console.warn('Could not read media from IndexedDB', err);
    return null;
  }
}

/**
 * Delete a media file from IndexedDB
 */
export async function removeMediaBlob(key: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not delete media from IndexedDB', err);
  }
}

/**
 * Category-specific permanent image persistence helpers (Base64 Data URLs)
 * Storing data URLs directly prevents ephemeral blob URL expiration across browser reloads
 */
export async function saveCategoryImageDataUrl(catId: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, `cat_b64_${catId}`);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save category image dataUrl to IndexedDB', err);
  }
}

export async function getCategoryImageDataUrl(catId: string): Promise<string | null> {
  try {
    const db = await openDB();
    return await new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(`cat_b64_${catId}`);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not read category image dataUrl from IndexedDB', err);
    return null;
  }
}

export async function removeCategoryImageDataUrl(catId: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(`cat_b64_${catId}`);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not delete category image dataUrl from IndexedDB', err);
  }
}

/**
 * Legacy Blob helpers (retained for backward compatibility)
 */
export async function saveCategoryImageBlob(catId: string, blob: Blob): Promise<string> {
  return saveMediaBlob(`cat_img_${catId}`, blob);
}

export async function getCategoryImageBlobUrl(catId: string): Promise<string | null> {
  return getMediaUrl(`cat_img_${catId}`);
}

export async function removeCategoryImageBlob(catId: string): Promise<void> {
  return removeMediaBlob(`cat_img_${catId}`);
}

/**
 * Product Video persistence in IndexedDB
 * Allows video uploads from desktop/laptop up to 100MB to persist locally
 */
export async function saveProductVideoBlob(key: string, file: File): Promise<string> {
  return saveMediaBlob(`prod_vid_${key}`, file);
}

export async function getProductVideoBlobUrl(key: string): Promise<string | null> {
  return getMediaUrl(`prod_vid_${key}`);
}

export async function removeProductVideoBlob(key: string): Promise<void> {
  return removeMediaBlob(`prod_vid_${key}`);
}

