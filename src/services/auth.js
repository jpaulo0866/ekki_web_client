import api from './api.interceptor';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const TOKEN_KEY = "ekki_token";
export const isAuthenticated = () => cookies.get(TOKEN_KEY) != null;
export const getToken = () => isAuthenticated() ? JSON.parse(cookies.get(TOKEN_KEY, { doNotParse: true })) : null;
export const setToken = token => {
  let expireDate = new Date();
  expireDate.setHours(expireDate.getHours() + 1);
  cookies.set(TOKEN_KEY, JSON.stringify(token), { path: '/', expires: expireDate });
};

export const login = (email, password) => {
  return api.post('/login', { email: email, password: password });
}

export const changePass = (email, password, newPassword, token) => {
  return api.put('/user/changepass', { email, password, newPassword, token });
}

export const logout = () => {
  cookies.remove(TOKEN_KEY);
  window.location.reload();
};