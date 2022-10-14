import { put, takeLatest } from 'redux-saga/effects';
import Cookies from 'js-cookie';

import { CONSTANTS } from '@constants';
import { URL } from '@url';
import { login } from '@app/services/User';
import { setCookieToken, setRefreshToken } from '@app/common/functionCommons';

export const actionTypes = {
  ToggleLoading: 'App/ToggleLoading',
  ToggleSider: 'App/ToggleSider',
  ToggleBroken: 'App/ToggleBroken',
  Login: 'App/Login',
  SetToken: 'App/SetToken',
  GetToken: 'App/GetToken',
  ClearToken: 'App/ClearToken',
  SetLocationPathCode: 'App/SetLocationPathCode',
};

const initialState = {
  siderCollapsed: false,
  isBroken: false,
  token: CONSTANTS.INITIAL,
  locationPathCode: null,
};
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ToggleLoading: {
      const { isLoading } = action.payload;
      return Object.assign({}, state, { isLoading });
    }
    case actionTypes.ToggleSider: {
      const { siderCollapsed } = action.payload;
      return Object.assign({}, state, { siderCollapsed });
    }
    case actionTypes.ClearToken: {
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      localStorage.setItem(window.location.host + 'logout', true);
      return Object.assign({}, state, { token: null, refreshToken: null });
    }
    case actionTypes.SetToken: {
      const { data } = action.payload;
      const token = data.accessToken;
      setCookieToken(token);
      setRefreshToken(data.refreshToken);
      localStorage.removeItem(window.location.host + 'logout');
      return Object.assign({}, state, { token });
    }
    case actionTypes.GetToken: {
      const token = Cookies.get('token');
      return Object.assign({}, state, { token });
    }
    case actionTypes.SetLocationPathCode: {
      const { locationPathCode } = action.payload;
      return Object.assign({}, state, { locationPathCode });
    }
    default:
      return state;
  }
};

export const actions = {
  toggleLoading: (isLoading) => ({ type: actionTypes.ToggleLoading, payload: { isLoading } }),
  toggleSider: (siderCollapsed) => ({ type: actionTypes.ToggleSider, payload: { siderCollapsed } }),
  login: (data, history) => ({ type: actionTypes.Login, payload: { data, history } }),
  getToken: () => ({ type: actionTypes.GetToken }),
  setToken: (data) => ({ type: actionTypes.SetToken, payload: { data } }),
  clearToken: () => ({ type: actionTypes.ClearToken, payload: { token: null } }),
  setLocationPathCode: (locationPathCode) => ({ type: actionTypes.SetLocationPathCode, payload: { locationPathCode } }),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga(data) {
    const dataResponse = yield login(data?.payload?.data);
    if (dataResponse) {
      yield put(actions.setToken(dataResponse));
      data?.payload.history.push(URL.MENU.DATASET);
    }
  });
}
