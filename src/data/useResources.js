import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, increment } from 'firebase/firestore';
import { db } from '../firebase';

export function useResources() {
  const [resources, setResources] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Listen for real-time updates from Firestore
    const unsubscribe = onSnapshot(
      collection(db, 'resources'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort newest first by date string descending
        data.sort((a,b) => new Date(b.date || 0) < new Date(a.date || 0) ? 1 : -1);
        setResources(data);
        setLoaded(true);
      },
      (error) => {
        console.error("Error fetching resources:", error);
        setLoaded(true); // Don't block loading state forever on error
      }
    );
    return () => unsubscribe();
  }, []);

  const addResource = async (resource) => {
    try {
      const newResource = {
        ...resource,
        downloads: 0,
        date: new Date().toISOString().split('T')[0],
      };
      await addDoc(collection(db, 'resources'), newResource);
      return { ...newResource, id: "temp" }; 
      // Real document with its assigned ID will sync back via onSnapshot
    } catch(err) {
      console.error("Error adding resource:", err);
      throw err;
    }
  }

  const incrementDownload = async (id) => {
    try {
      await updateDoc(doc(db, 'resources', id), {
        downloads: increment(1)
      });
    } catch(err) {
      console.error("Error incrementing download:", err);
    }
  }

  const deleteResource = async (id) => {
    try {
      await deleteDoc(doc(db, 'resources', id));
    } catch(err) {
      console.error("Error deleting resource:", err);
    }
  }

  return { resources, addResource, incrementDownload, deleteResource, loaded };
}
