import Cookies from 'js-cookie';

const TOKEN_NAME = 'phutokenvercel';
const TOKEN_EXPIRY_DAYS = 7;

export const AuthService = {
  /**
   * Store authentication token in cookies
   */
  setToken(token) {
    if (token) {
      Cookies.set(TOKEN_NAME, token, { expires: TOKEN_EXPIRY_DAYS });
      return true;
    }
    return false;
  },

  /**
   * Get authentication token from cookies
   */
  getToken() {
    return Cookies.get(TOKEN_NAME);
  },

  /**
   * Remove authentication token
   */
  removeToken() {
    Cookies.remove(TOKEN_NAME);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Auto-login using Vercel environment token
   */
  autoLogin() {
    const vercelToken = process.env.PHUTOKENVERCEL || process.env.NEXT_PUBLIC_PHUTOKENVERCEL;
    
    if (vercelToken && !this.isAuthenticated()) {
      this.setToken(vercelToken);
      return true;
    }
    
    return this.isAuthenticated();
  }
};
