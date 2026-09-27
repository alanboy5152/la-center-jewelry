import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { firestoreDb, handleFirestoreError, OperationType, testFirestoreConnection } from './firebase';
import { Product, Category, Order, SiteSettings, Customer, Banner, StorefrontMediaItem, Review, HeroConfig } from '../types';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, DEFAULT_CUSTOMERS, db } from './databaseService';

// Initialize connection test
testFirestoreConnection();

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const ORDERS_COLLECTION = 'orders';
const CUSTOMERS_COLLECTION = 'customers';
const SETTINGS_COLLECTION = 'settings';

/**
 * Seed initial data to Firestore if collection is empty
 */
export async function seedFirestoreIfEmpty() {
  try {
    const productsSnapshot = await getDocs(collection(firestoreDb, PRODUCTS_COLLECTION));
    if (productsSnapshot.empty) {
      console.log('Seeding initial products to Firestore...');
      const batch = writeBatch(firestoreDb);
      // Seed first batch of products
      DEFAULT_PRODUCTS.slice(0, 15).forEach((p) => {
        const ref = doc(firestoreDb, PRODUCTS_COLLECTION, p.id);
        batch.set(ref, sanitizeForFirestore(p));
      });
      await batch.commit();
    }
  } catch (error) {
    console.warn('Firestore products seed check bypassed (offline/rules):', error);
  }

  try {
    const categoriesSnapshot = await getDocs(collection(firestoreDb, CATEGORIES_COLLECTION));
    if (categoriesSnapshot.empty) {
      console.log('Seeding initial categories to Firestore...');
      const batch = writeBatch(firestoreDb);
      DEFAULT_CATEGORIES.forEach((c) => {
        const ref = doc(firestoreDb, CATEGORIES_COLLECTION, c.id);
        batch.set(ref, sanitizeForFirestore(c));
      });
      await batch.commit();
    }
  } catch (error) {
    console.warn('Firestore categories seed check bypassed:', error);
  }
}

/**
 * Strips undefined properties and cleans objects for Firestore compatibility
 */
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        result[key] = value.map((item) =>
          typeof item === 'object' && item !== null ? sanitizeForFirestore(item) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        result[key] = sanitizeForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Real-time listener for Products collection
 */
export function subscribeToProducts(onProductsUpdated: (products: Product[]) => void): () => void {
  try {
    const colRef = collection(firestoreDb, PRODUCTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const prods: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Product;
            prods.push({
              ...data,
              id: docSnap.id,
            });
          });
          onProductsUpdated(prods);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, PRODUCTS_COLLECTION);
      }
    );
  } catch (error) {
    console.warn('Could not subscribe to Firestore products:', error);
    return () => {};
  }
}

/**
 * Real-time listener for Categories collection
 */
export function subscribeToCategories(onCategoriesUpdated: (categories: Category[]) => void): () => void {
  try {
    const colRef = collection(firestoreDb, CATEGORIES_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cats: Category[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Category;
            cats.push({
              ...data,
              id: docSnap.id,
            });
          });
          onCategoriesUpdated(cats);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, CATEGORIES_COLLECTION);
      }
    );
  } catch (error) {
    console.warn('Could not subscribe to Firestore categories:', error);
    return () => {};
  }
}

/**
 * Real-time listener for Orders collection
 */
export function subscribeToOrders(onOrdersUpdated: (orders: Order[]) => void): () => void {
  try {
    const colRef = collection(firestoreDb, ORDERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const orders: Order[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Order;
            orders.push({
              ...data,
              id: docSnap.id,
            });
          });
          onOrdersUpdated(orders);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, ORDERS_COLLECTION);
      }
    );
  } catch (error) {
    console.warn('Could not subscribe to Firestore orders:', error);
    return () => {};
  }
}

/**
 * Real-time listener for General Settings document
 */
export function subscribeToSettings(onSettingsUpdated: (settings: SiteSettings) => void): () => void {
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, 'general');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SiteSettings;
          onSettingsUpdated(data);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/general`);
      }
    );
  } catch (error) {
    console.warn('Could not subscribe to Firestore settings:', error);
    return () => {};
  }
}

/**
 * Write operations with Firestore error handling
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${product.id}`;
  try {
    const docRef = doc(firestoreDb, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, sanitizeForFirestore(product), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    const docRef = doc(firestoreDb, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveCategoryToFirestore(category: Category): Promise<void> {
  const path = `${CATEGORIES_COLLECTION}/${category.id}`;
  try {
    const docRef = doc(firestoreDb, CATEGORIES_COLLECTION, category.id);
    await setDoc(docRef, sanitizeForFirestore(category), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCategoryFromFirestore(categoryId: string): Promise<void> {
  const path = `${CATEGORIES_COLLECTION}/${categoryId}`;
  try {
    const docRef = doc(firestoreDb, CATEGORIES_COLLECTION, categoryId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveOrderToFirestore(order: Order): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${order.id}`;
  try {
    const docRef = doc(firestoreDb, ORDERS_COLLECTION, order.id);
    await setDoc(docRef, sanitizeForFirestore(order), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for Customers & Registered Users collection
 */
export function subscribeToCustomers(onCustomersUpdated: (customers: Customer[]) => void): () => void {
  try {
    const colRef = collection(firestoreDb, CUSTOMERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const custs: Customer[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Customer;
            custs.push({
              ...data,
              id: docSnap.id,
            });
          });
          onCustomersUpdated(custs);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, CUSTOMERS_COLLECTION);
      }
    );
  } catch (error) {
    console.warn('Could not subscribe to Firestore customers:', error);
    return () => {};
  }
}

export async function saveCustomerToFirestore(customer: Customer): Promise<void> {
  const path = `${CUSTOMERS_COLLECTION}/${customer.id}`;
  try {
    const docRef = doc(firestoreDb, CUSTOMERS_COLLECTION, customer.id);
    await setDoc(docRef, sanitizeForFirestore(customer), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCustomerFromFirestore(customerId: string): Promise<void> {
  const path = `${CUSTOMERS_COLLECTION}/${customerId}`;
  try {
    const docRef = doc(firestoreDb, CUSTOMERS_COLLECTION, customerId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveSettingsToFirestore(settings: SiteSettings): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/general`;
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, 'general');
    await setDoc(docRef, sanitizeForFirestore(settings), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for Promotional Banners
 */
export function subscribeToBanners(onBannersUpdated: (banners: Banner[]) => void): () => void {
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, 'banners');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.list) && data.list.length > 0) {
            onBannersUpdated(data.list as Banner[]);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/banners`);
      }
    );
  } catch (error) {
    console.warn('Could not subscribe to Firestore banners:', error);
    return () => {};
  }
}

export async function saveBannersToFirestore(banners: Banner[]): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/banners`;
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, 'banners');
    await setDoc(docRef, { list: banners.map((b) => sanitizeForFirestore(b)) }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for Storefront Media
 */
export function subscribeToStorefrontMedia(
  onMediaUpdated: (media: StorefrontMediaItem[]) => void
): () => void {
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, 'storefront_media');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.list) && data.list.length > 0) {
            onMediaUpdated(data.list as StorefrontMediaItem[]);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/storefront_media`);
      }
    );
  } catch (error) {
    console.warn('Could not subscribe to Firestore storefront media:', error);
    return () => {};
  }
}

export async function saveStorefrontMediaToFirestore(media: StorefrontMediaItem[]): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/storefront_media`;
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, 'storefront_media');
    await setDoc(docRef, { list: media.map((m) => sanitizeForFirestore(m)) }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for Product Reviews
 */
export function subscribeToReviews(onReviewsUpdated: (reviews: Review[]) => void): () => void {
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, 'reviews');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.list) && data.list.length > 0) {
            onReviewsUpdated(data.list as Review[]);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/reviews`);
      }
    );
  } catch (error) {
    console.warn('Could not subscribe to Firestore reviews:', error);
    return () => {};
  }
}

export async function saveReviewsToFirestore(reviews: Review[]): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/reviews`;
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, 'reviews');
    await setDoc(docRef, { list: reviews.map((r) => sanitizeForFirestore(r)) }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for Storefront Hero Section Config
 */
export function subscribeToHeroConfig(onHeroUpdated: (hero: HeroConfig) => void): () => void {
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, 'hero');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && typeof data === 'object') {
            onHeroUpdated(data as HeroConfig);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/hero`);
      }
    );
  } catch (error) {
    console.warn('Could not subscribe to Firestore hero:', error);
    return () => {};
  }
}

export async function saveHeroConfigToFirestore(hero: HeroConfig): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/hero`;
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, 'hero');
    // Don't send machine-local ephemeral blob URLs to Firestore
    const sanitized = { ...hero };
    if (sanitized.videoUrl?.startsWith('blob:')) {
      delete (sanitized as Record<string, unknown>).videoUrl;
    }
    if (sanitized.mobileVideoUrl?.startsWith('blob:')) {
      delete (sanitized as Record<string, unknown>).mobileVideoUrl;
    }
    await setDoc(docRef, sanitizeForFirestore(sanitized), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}


