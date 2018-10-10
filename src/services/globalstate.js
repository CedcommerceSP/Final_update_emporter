import { environment } from '../environments/environment';

export const globalState = {
    setLocalStorage: (key, value) => {
        sessionStorage.setItem(key, value);
    },
    getLocalStorage: (key) => {
        return sessionStorage.getItem(key);
    },
    removeLocalStorage: (key) => {
        return sessionStorage.removeItem(key);
    },
    getBearerToken: () => {
        if (sessionStorage.getItem('user_authenticated') !== 'true') {
            return environment.Bearer;
        } else {
            return sessionStorage.getItem('auth_token');
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
    },
    log: (msg) => {
        return environment.isLive?null:console.log(msg);
    },
};