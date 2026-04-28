import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

export function useFirestoreCollection<T>(collectionName: string, userOnly = true, limitTo?: number) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser && userOnly) {
      setData([]);
      setLoading(false);
      return;
    }

    let q = query(collection(db, collectionName));
    
    if (userOnly && auth.currentUser) {
      q = query(q, where('userId', '==', auth.currentUser.uid));
    }
    
    // Some collections might not have createdAt, so we only order if requested or specific
    if (collectionName === 'stores') {
      q = query(q, orderBy('sales', 'desc'));
    }

    if (limitTo) {
      q = query(q, limit(limitTo));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result: T[] = [];
      snapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() } as T);
      });
      setData(result);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, collectionName);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, userOnly, limitTo, auth.currentUser?.uid]);

  const add = async (item: Partial<T>) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, collectionName), {
        ...item,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, collectionName);
    }
  };

  const update = async (id: string, item: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...item,
        updatedAt: serverTimestamp(),
      } as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
    }
  };

  const remove = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
    }
  };

  return { data, loading, add, update, remove };
}
