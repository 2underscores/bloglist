import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

/**
 * Manage syncing changes between React authed user and local storage:
 * - From local storage to React state on first render
 * - From React state to local storage on every change
 *
 * @returns {[undefined | null | object, object]} normal useState return, but wraps some useEffects
 * 
 * The `authToken` can be:
 * - `undefined` if not initialized i.e. first render
 * - `null` if the user is not logged in
 * - `object` containing the user's auth token
 */
export default function useAuth() {
  // Helper function for initial load
  const getUserAuthTokenFromStorage = () => {
    const userToken = window.localStorage.getItem('userAuthToken');
    if (!userToken) {
      console.log("No user token in localStorage")
      return null;
    }
    console.log("User token retrieved from localStorage: ", userToken);
    const decodedToken = jwtDecode(userToken);
    const tokenExpired = decodedToken.exp < Date.now() / 1000;
    if (tokenExpired) {
      console.log("localStorage user token expired, discarding")
      return null;
    }
    return userToken;
  };

  const [authedUser, setAuthedUser] = useState(() => {
    const token = getUserAuthTokenFromStorage()
    return token ? { tokenEncoded: token, token: jwtDecode(token) } : null;
  });

  // On auth change, push to localStorage
  useEffect(() => {
    if (!authedUser) {
      console.log("User none/removed/logged out, wipe local storage.");
      window.localStorage.removeItem('userAuthToken');
    } else if (authedUser.tokenEncoded) {
      console.log("User has been set, updating local storage.");
      window.localStorage.setItem('userAuthToken', authedUser.tokenEncoded);
    } else {
      console.error("Invalid authedUser state: ", authedUser);
    }
  }, [authedUser]);

  return [authedUser, setAuthedUser];
}