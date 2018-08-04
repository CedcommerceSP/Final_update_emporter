import { environment } from '../environments/environment';
import { globalState } from './globalstate';

import { isUndefined } from 'util';

export const requests = {
    getRequest: (endpoint, params, fullUrl) => {
        window.showLoader = true;
        let paramsString = '';
        if (!isUndefined(params)) {
            paramsString += '?';
            for (let i = 0; i < Object.keys(params).length; i++) {
                const end = (i < (Object.keys(params).length - 1)) ? '&' : '';
                paramsString += Object.keys(params)[i] + '=' + params[Object.keys(params)[i]] + end;
            }
        }
        if (isUndefined(fullUrl)) {
            return fetch(environment.API_ENDPOINT + endpoint + paramsString, {
                method: 'GET',
                headers: {
                    'Authorization': globalState.getBearerToken()
                }
            })
                .then((res) => {
                    window.showLoader = false;
                    return res.json();
                });
        } else {
            return fetch(endpoint + paramsString, {
                method: 'GET',
                headers: {
                    'Authorization': globalState.getBearerToken()
                }
            })
                .then((res) => {
                    window.showLoader = false;
                    return res.json();
                });
        }
    },
    postRequest: (endpoint, data) => {
        window.showLoader = true;
        return fetch(environment.API_ENDPOINT + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': globalState.getBearerToken()
            },
            body: JSON.stringify(data)
        })
            .then((res) => {
                window.showLoader = false;
                return res.json();
            });
    }
};