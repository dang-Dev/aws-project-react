import { Redirect } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { useEffect, useState } from "react";
const ProtectedRoute = ({children}) => {
    const [user1, setUser] = useState({});
    useEffect( () => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        }
    }, []);
    
    if (!user1){
        return <Redirect to="/sign-in"/>
    }
    return children;
}
export default ProtectedRoute;