import axios from 'axios';
import router from "@/router/index.js";


//Authed
export let authClient = axios.create({});
authClient.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
authClient.defaults.baseURL = 'http://localhost:8000/api';
authClient.interceptors.response.use(undefined, function (error) {
    console.log(error);
    if(error.response.status === 401) {
        window.localStorage.clear();
        router.push('/auth');
        return Promise.reject(error);
    }
});

// NoneAuthed
export let client = axios.create({});
client.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
client.defaults.baseURL = 'http://localhost:8000/api';

export default {
    authClient,
    client
}
