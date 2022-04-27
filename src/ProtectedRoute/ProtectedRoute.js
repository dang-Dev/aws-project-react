import { useUserAuth } from "../context/UserAuthContext";
import { Redirect } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    let { user } = useUserAuth();
    if (!user){
       return <Redirect to="/sign-in"/>
    }
    return children;
}
export default ProtectedRoute;