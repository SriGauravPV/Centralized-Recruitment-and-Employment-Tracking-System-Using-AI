import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Import your Firestore config

const FirestoreTest = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });
      } catch (error) {
        console.error("Firestore error:", error);
      }
    };
    fetchData();
  }, []);

  return <h2>Firestore Test</h2>;
};

export default FirestoreTest;
