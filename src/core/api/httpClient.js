import axios from 'axios';
import { authHeader } from '../services/auth-header';

let url = window.location.href
let arr = url.split("/");
let host = arr[0] + "//" + arr[2] + '/'

export const get = function(uri, data) {
    return new Promise(function (resolve, reject) {
        axios(host + uri, {
						method: 'GET',
						params: data,
						headers: authHeader()
        }).then(res => {
            if (res.status !== 200) {
                throw Error(res.statusText);
            }

            resolve(res.data);
        }).catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

export const post = function(uri, data) {
	return new Promise(function (resolve, reject) {
			axios(host + uri, {
					method: 'POST',
					data: data,
					headers: authHeader()
			}).then(res => {
					resolve(res.data);
			}).catch(err => {
							console.log(err);
							reject(err);
					});
	});
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}