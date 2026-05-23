import axios from 'axios';

//This create the instance of the axios
const api=axios.create({
    baseURL:'http://localhost:8000/api',
    timeout:5000,
    headers:{
        'Content-Type':'application/json'
    }
});

//The request intercetor

api.interceptors.request.use(
    (config)=>
    {
        const token = localStorage.getItem('access_token');

        if(token)
        {
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config;
    },
    (error)=>
    {
        return Promise.reject(error);
    }
);

//the response interceptor

api.interceptors.response.use(
    (response)=>
    {
        return response;
    },
    (error)=>
    {
        if(error.response&&error.response.status===401)
        {
            console.warn("Session Expired .Please return to the login page.");

            localStorage.removeItem('access_token');

            window.location.href='/login';

        }
        return Promise.reject(error);
    }

);

export default api ;

