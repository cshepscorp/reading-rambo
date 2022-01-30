import decode from "jwt-decode";

// creating a new JavaScript class called AuthService that we instantiate a new version of for every component that imports it
class AuthService {
  // retrieve data saved in token
  getProfile() {
    return decode(this.getToken());
  }

  // is user still logged in?
  loggedIn() {
    // is there a valid saved token?
    const token = this.getToken();
    // use type coersion to check if token is NOT undefined and the it's NOT expired
    return !!token && !this.isTokenExpired(token);
  }

  // is the token expired?
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  // retrieve token from localStorage
  getToken() {
    // retrieves user token from LS
    return localStorage.getItem("id_token");
  }

  /// set token to localStorage and reload page to homepage
  login(idToken) {
    // saves user token to LS
    localStorage.setItem("id_token", idToken);

    window.location.assign("/");
  }

  // clear token from localStorage and force logout with reload
  logout() {
    // clear user token and profile data from LS
    localStorage.removeItem("id_token");
    // reload page and reset state of application
    window.location.assign("/");
  }
}

export default new AuthService();
