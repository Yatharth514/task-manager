import React,{createContext,useEffect,useState} from "react";
import AuthService from "../services/Authservice";

export const AuthContext=createContext(null);//create a storage box for global authentication data 

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const token =localStorage.getItem('access_token');
        if(token)
        {
            setUser({loggedIn:true});
        }
        setLoading(false);
    },[]);
    
    const register=async(credentials)=>{
        const data=await AuthService.register(credentials);
        //we can set user as logged in if we have to avoid the login  again 
        return data;
    };
    const login=async(credentials)=>{
        const data=await AuthService.login(credentials);
        localStorage.setItem('access_token', data.access_token);//we will store the access token here
        setUser({loggedIn:true});
        return data;
    };
    const logout=()=>{
        localStorage.removeItem('access_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{login,logout,register,user,loading}}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => React.useContext(AuthContext);
export default AuthProvider;
