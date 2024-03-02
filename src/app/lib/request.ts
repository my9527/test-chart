

import axios from "axios";


// config axios global

export const request = axios.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

// config authoracation here
request.interceptors.request.use((config) => {

    return config;
});


request.interceptors.response.use((res) => {

    return res;
});



