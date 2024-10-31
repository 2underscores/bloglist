import CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import Blogs from './components/Blogs';
import Login from './components/Login';
import NewBlog from './components/NewBlog';
import Notifications from "./components/Notifications";
import blogService from './services/blogs';

function App() {
  const [user, setUser] = useState(undefined) // undefined | null | object = user
  const [blogs, setBlogs] = useState([])
  const [notifications, setNotifications] = useState([])

  // On refresh retrieve stored user/auth
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser') || null
    console.log("User from local storage: ", loggedUserJSON);
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      loggedUser.decodedToken = jwtDecode(loggedUser.token);
      const tokenExpired = (loggedUser.decodedToken.exp < Date.now() / 1000)
      if (tokenExpired) {
        console.log("Token expired, logging out.")
        setUser(null)
        pushNotif({ type: 'error', message: 'Session expired, please log in again.' })
      } else {
        setUser(JSON.parse(loggedUserJSON))
      }
    } else {
      console.log("No user in local storage.")
      setUser(null)
    }
  }, [])

  // On user change:
  useEffect(() => {
    // update external stores of user/auth
    if (user === undefined) {
      console.log("User is undefined, this is initial load. Don't wipe local storage.");
    } else if (user === null) {
      console.log("User has been removed, wipe local storage.")
      window.localStorage.removeItem('loggedInUser') // This is duplicated in logout function
    } else {
      console.log("Setting local storage user to: ", user)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
    }
    // Update blogs
    if (user) {
      blogService
        .list(user.token) // DI token to service layer, not service layer using centralised getter of localStorage
        .then(bgs => setBlogs(bgs))
    } else {
      setBlogs([])
    }
  }, [user])

  const pushNotif = (notif) => {
    const time = Date.now()
    const uniqueStr = `${notif.type}${notif.message}${time}`
    const id = CryptoJS.SHA256(uniqueStr).toString()
    setNotifications((preNotifs) => [
      ...preNotifs,
      {
        ...notif,
        ...{ time, id }
      }])
    // Delete notification after 5s
    setTimeout(() => {
      setNotifications((preNotifs) => preNotifs.filter(n => n.id !== id))
    }, 3000)
  }

  return (
    <>
      <Login user={user} setUser={setUser} pushNotif={pushNotif} />
      {user && <NewBlog user={user} setBlogs={setBlogs} pushNotif={pushNotif} />}
      {user && <Blogs user={user} blogs={blogs} pushNotif={pushNotif} />}
      <Notifications notifications={notifications} setNotifications={setNotifications} />
    </>
  )
}

export default App
