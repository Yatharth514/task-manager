import api from './api';

const AuthService={
    register:async(credentials)=>{
        const response =await api.post('/auth/register',credentials);
        return response.data;
    },
    login:async(credentials)=>{
        const response=await api.post('/auth/login',credentials);
        return response.data;
    }
};
export default AuthService;