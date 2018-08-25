import { environment } from '../environments/environment';
import { globalState } from './globalstate';

import { isUndefined } from 'util';

export const requests = {
    getRequest: (endpoint, params, fullUrl, hideLoader) => {
        if (isUndefined(hideLoader) || !hideLoader) {
            window.showLoader = true;
        }
        let paramsString = '';
        if (!isUndefined(params)) {
            paramsString += '?';
            for (let i = 0; i < Object.keys(params).length; i++) {
                const end = (i < (Object.keys(params).length - 1)) ? '&' : '';
                paramsString += Object.keys(params)[i] + '=' + encodeURIComponent(params[Object.keys(params)[i]]) + end;
            }
        }
        if (isUndefined(fullUrl) || !fullUrl) {
            return fetch(environment.API_ENDPOINT + endpoint + paramsString, {
                method: 'GET',
                headers: {
                    'Authorization': globalState.getBearerToken()
                }
            })
                .then((res) => {
                    if (isUndefined(hideLoader) || !hideLoader) {
                        window.showLoader = false;
                    }
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
                    if (isUndefined(hideLoader) || !hideLoader) {
                        window.showLoader = false;
                    }
                    return res.json();
                });
        }
    },
    postRequest: (endpoint, data, fullUrl, hideLoader) => {
        if (isUndefined(hideLoader) || !hideLoader) {
            window.showLoader = true;
        }
        if (isUndefined(fullUrl) || fullUrl) {
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
                    if (isUndefined(hideLoader) || !hideLoader) {
                        window.showLoader = false;
                    }
                    return res.json();
                });
        } else {
            return fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': globalState.getBearerToken()
                },
                body: JSON.stringify(data)
            })
                .then((res) => {
                    if (isUndefined(hideLoader) || !hideLoader) {
                        window.showLoader = false;
                    }
                    return res.json();
                });
        }
    }
};