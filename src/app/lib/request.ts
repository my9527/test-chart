

import axios from "axios";


// config axios global

export const request = axios.create({
    baseURL: 'https://api-testnet.substancex.io/',
    timeout: 1000,
    headers: {
        
    }
});

// config authoracation here
request.interceptors.request.use((config) => {

    return config;
});


request.interceptors.response.use((res) => {

    return res;
});



