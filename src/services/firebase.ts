import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Check session storage on initial load to avoid pounding Firestore if quota was already exceeded
export let isFirestoreQuotaExceeded: boolean = (() => {
  try {
    return typeof window !== 'undefined' && sessionStorage.getItem('firestore_quota_exceeded') === 'true';
  } catch {
    return false;
  }
})();

export function markFirestoreQuotaExceeded() {
  isFirestoreQuotaExceeded = true;
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('firestore_quota_exceeded', 'true');
    }
  } catch {
    // Ignore storage errors
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  const isQuota =
    errorMessage.includes('Quota limit exceeded') ||
    errorMessage.includes('resource-exhausted') ||
    errorMessage.includes('Free daily read units per project');

  if (isQuota) {
    markFirestoreQuotaExceeded();
  }

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };

  // If this is a permission error, strictly follow the Firebase security rules audit logging specification
  if (!isQuota) {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } else {
    // For quota exhaustion, warn gracefully so that local storage fallback operates seamlessly
    console.warn('Firestore daily read quota limit reached. Using local cache & storage:', path);
  }
}

// Test connection on boot per Firebase skill guidelines
export async function testFirestoreConnection() {
  if (isFirestoreQuotaExceeded) return;
  try {
    await getDocFromServer(doc(firestoreDb, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    } else if (
      error instanceof Error &&
      (error.message.includes('Quota limit exceeded') ||
        error.message.includes('resource-exhausted') ||
        error.message.includes('Free daily read units'))
    ) {
      markFirestoreQuotaExceeded();
      console.warn('Firestore connection: daily quota limit reached.');
    }
  }
}
