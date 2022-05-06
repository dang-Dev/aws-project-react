import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth'
import { getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBHJgVaqRG6tPMyFSX5H2aKTOfnT0ouFns",
  authDomain: "aws-react-project.firebaseapp.com",
  projectId: "aws-react-project",
  storageBucket: "aws-react-project.appspot.com",
  messagingSenderId: "197527850462",
  appId: "1:197527850462:web:f8a87ebaff8bd145cde14f",
  measurementId: "G-4DR60LDJE6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;