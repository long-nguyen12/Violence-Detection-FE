import Cookies from 'js-cookie';
import { API } from '@api';
import { CONSTANTS, TOAST_MESSAGE } from '@constants';
import { checkRefeshToken, checkTokenExp, setCookieToken, setRefreshToken, toast } from '@app/common/functionCommons';
import * as app from '@app/store/ducks/app.duck';
import { getAccessToken } from '@app/services/User';

export function setupAxios(axios, store) {
  const { dispatch } = store;
  let countApiRequest = 0;
  let countApiResponse = 0;
  let isRefreshToken = false;

  axios.interceptors.request.use(
    async config => {
      if (!config.hasOwnProperty('loading')) {
        config.loading = true;
      }
      if (config.loading) {
        countApiRequest++;
      }

      const { app: { isLoading } } = store.getState();
      const authToken = Cookies.get('token');
      const refreshToken = Cookies.get('refreshToken');

      if ([API.REFRESH_TOKEN, API.LOGIN].includes(config.url)) {
        return config;
      }

      if (!isRefreshToken && checkRefeshToken(authToken) < (CONSTANTS.TIME_REFRESH * 60)) {
        const refreshToken = Cookies.get('refreshToken');
        isRefreshToken = true;
        const dataAccessToken = await getAccessToken(refreshToken);
        if (dataAccessToken) {
          setCookieToken(dataAccessToken.accessToken);
          setRefreshToken(dataAccessToken.refreshToken);
        }
        isRefreshToken = false;
      }

      if (!authToken && refreshToken) {
        if (refreshToken) {
          const dataAccessToken = await getAccessToken(refreshToken);
          if (dataAccessToken) {
            dispatch(app.actions.setToken(dataAccessToken));
          }
          const authToken = Cookies.get('accessToken');
          config.headers = { 'x-access-token': authToken};
          return config;
        } else {
          throw new axios.Cancel(CONSTANTS.CANCEL);
        }
      }
      config.headers = { 'x-access-token': authToken, };
      if (!isLoading && countApiRequest !== countApiResponse) {
        dispatch(app.actions.toggleLoading(true));
      }
      return config;
    },
    err => Promise.reject(err),
  );

  try {
    axios.interceptors.response.use(res => {
      if (res.config.loading) {
        countApiResponse++;
      }
      if (countApiRequest === countApiResponse) {
        dispatch(app.actions.toggleLoading(false));
      }

      if (res.data.success === false) {
        toast(CONSTANTS.ERROR, res.data.message || TOAST_MESSAGE.ERROR.DEFAULT);
        res.data = null;
      }
      return res;
    }, error => {
      if (error.config.loading) {
        countApiResponse++;
      }
      if (countApiRequest === countApiResponse) {
        dispatch(app.actions.toggleLoading(false));
      }
      if ([401, 422].includes(error?.response?.status)) {
        dispatch(app.actions.clearToken());
        return Promise.reject(error);
      }
      return Promise.reject(error);
    });
  } catch (error) {
    if (error.config.loading) {
      countApiResponse++;
    }
    if (countApiRequest === countApiResponse) {
      dispatch(app.actions.toggleLoading(false));
    }
  }

}

/*  removeStorage: removes a key from localStorage and its sibling expiracy key
    params:
        key <string>     : localStorage key to remove
    returns:
        <boolean> : telling if operation succeeded
 */
export function removeStorage(key) {
  try {
    localStorage.setItem(key, '');
    localStorage.setItem(key + '_expiresIn', '');
  } catch (e) {
    console.log(
      'removeStorage: Error removing key [' +
      key +
      '] from localStorage: ' +
      JSON.stringify(e),
    );
    return false;
  }
  return true;
}

/*  getStorage: retrieves a key from localStorage previously set with setStorage().
    params:
        key <string> : localStorage key
    returns:
        <string> : value of localStorage key
        null : in case of expired key or failure
 */
export function getStorage(key) {
  const now = Date.now(); //epoch time, lets deal only with integer
  // set expiration for storage
  let expiresIn = localStorage.getItem(key + '_expiresIn');
  if (expiresIn === undefined || expiresIn === null) {
    expiresIn = 0;
  }

  expiresIn = Math.abs(expiresIn);
  if (expiresIn < now) {
    // Expired
    removeStorage(key);
    return null;
  } else {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.log(
        'getStorage: Error reading key [' +
        key +
        '] from localStorage: ' +
        JSON.stringify(e),
      );
      return null;
    }
  }
}

/*  setStorage: writes a key into localStorage setting a expire time
    params:
        key <string>     : localStorage key
        value <string>   : localStorage value
        expires <number> : number of seconds from now to expire the key
    returns:
        <boolean> : telling if operation succeeded
 */
export function setStorage(key, value, expires) {
  ``;
  if (expires === undefined || expires === null) {
    expires = 24 * 60 * 60; // default: seconds for 1 day
  }

  const now = Date.now(); //millisecs since epoch time, lets deal only with integer
  const schedule = now + expires * 1000;

  try {
    localStorage.setItem(key, value);
    localStorage.setItem(key + '_expiresIn', schedule);
  } catch (e) {
    console.log(
      'setStorage: Error setting key [' +
      key +
      '] in localStorage: ' +
      JSON.stringify(e),
    );
    return false;
  }
  return true;
}
