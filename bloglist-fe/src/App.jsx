import CryptoJS from 'crypto-js';
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
      setUser(JSON.parse(loggedUserJSON))
    }
  }, [])

  // On user change:
  useEffect(() => {
    // update external stores of user/auth
    if (user !== undefined) {
      console.log("Setting local storage user to: ", user)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
    } else {
      console.log("User is undefined, this is initial load. Don't write to local storage.");
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

  // Debugging
  useEffect(() => {
    const initialNotifs = [ // id and time added
      { type: 'error', message: 'Test error1' },
      { type: 'error', message: 'Test error2' },
      { type: 'success', message: 'Test success1' },
      { message: 'unknown type notif' },
    ]
    setNotifications([])
    initialNotifs.forEach((n) => pushNotif(n))
  }, [])

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
