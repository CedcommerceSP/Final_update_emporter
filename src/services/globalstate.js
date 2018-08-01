import { environment } from '../environments/environment';

import { Header } from '../components/Panel/Layout/header';

let activePageUrl = '';
export const globalState = {
    setLocalStorage: (key, value) => {
        localStorage.setItem(key, value);
    },
    getLocalStorage: (key) => {
        return localStorage.getItem(key);
    },
    removeLocalStorage: (key) => {
        return localStorage.removeItem(key);
    },
    getBearerToken: () => {
        if (localStorage.getItem('user_authenticated') !== 'true') {
            return environment.Bearer;
        } else {
            return localStorage.getItem('auth_token');
        }
    },
    prepareQuery: (params) => {
        let queryString = Object.keys(params).length > 0 ? '?' : '';
        let end = '';
        for (let i = 0; i < Object.keys(params).length; i++) {
            let key = params[Object.keys(params)[i]];
            queryString += end + key + '=' + params[key];
            key = '&';
        }
        return queryString;
    }
}