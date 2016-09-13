import {push} from "react-router-redux";
import axios from 'axios';
import { getLoggedInUser, clearLoggedInUser } from '../../user/redux/user';

export const START_AUTH = 'poniverse/auth/START_AUTH';
export const FINISH_AUTH = 'poniverse/auth/FINISH_AUTH';

export const LOGIN_REQUEST = 'poniverse/auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'poniverse/auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'poniverse/auth/LOGIN_FAILURE';

export const LOGOUT_SUCCESS = 'poniverse/auth/LOGOUT_SUCCESS';

export const SET_ACCESS_TOKEN = 'poniverse/auth/SET_ACCESS_TOKEN';

const initialState = {
  isFetching: false,
  showAuthModal: false,
  accessToken: null
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case START_AUTH:
      return {
        ...state,
        showAuthModal: true
      };
    case FINISH_AUTH:
      return {
        ...state,
        showAuthModal: false
      };

    case LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case LOGIN_SUCCESS:
    case LOGIN_FAILURE:
      return {
        ...state,
        isFetching: true
      };
    case LOGOUT_SUCCESS:
      return initialState;
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.accessToken
      };
    default:
      return state;
  }
}

export function startAuth() {
  return {
    type: START_AUTH
  }
}

export function finishAuth() {
  return {
    type: FINISH_AUTH
  }
}

export function loginRequest() {
  return {
    type: LOGIN_REQUEST
  }
}

export function loginSuccess() {
  return {
    type: LOGIN_SUCCESS
  }
}

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS
  };
}

export function login(username, password) {
  return (dispatch, getState) => {
    dispatch(loginRequest());

    return axios
      .post('/auth/login', {
        username: username,
        password: password
      }, {
        baseURL: '' // This request is being made to the local node server
      })
      .then(response => {
        axios.defaults.headers.common = {
          ...axios.defaults.headers.common,
          Authorization: 'Bearer ' + response.data.access_token
        };

        dispatch(loginSuccess());

        dispatch(getLoggedInUser())
          .then(() => {
            dispatch(finishAuth());
          });
      })
      .catch(error => {
        console.error('Login Error', error);
      });
  };
}

export function setAccessToken(accessToken) {
  axios.defaults.headers.common = {
    ...axios.defaults.headers.common,
    Authorization: 'Bearer ' + accessToken
  };

  return {
    type: SET_ACCESS_TOKEN,
    accessToken
  }
}

/**
 * Logout from the current session
 * @returns {function()}
 */
export function logout() {
  return dispatch => {
    delete axios.defaults.headers.common.Authorization;

    // Fire and forget
    axios
      .post('/auth/logout', {}, {
        baseURL: '' // This request is being made to the local node server
      })
      .then(() => {
        dispatch(clearLoggedInUser());
        dispatch(logoutSuccess());
      })
      .catch(error => {
        console.error('Logout', error);
      });
  };
}
