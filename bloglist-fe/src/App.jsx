import CryptoJS from 'crypto-js';
import { useEffect, useState } from "react";
import Blogs from './components/Blogs';
import Login from './components/Login';
import Logout from './components/Logout';
import NewBlog from './components/NewBlog';
import Notifications from "./components/Notifications";
import Togglable from './components/Togglable';
import useAuth from './hooks/auth';
import blogService from './services/blogs';

function App() {
  const [auth, setAuth] = useAuth();
  const [blogs, setBlogs] = useState([])
  const [notifications, setNotifications] = useState([])

  // Initialise state whenever user changes
  useEffect(() => {
    // Update blogs
    if (auth) {
      blogService
        .list(auth.tokenEncoded) // DI token to service layer, not service layer using centralised getter of localStorage
        .then(bgs => setBlogs(bgs))
    } else {
      setBlogs([])
    }
  }, [auth])

  // For UI notifications
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
      {auth && <Logout auth={auth} setAuth={setAuth} pushNotif={pushNotif} />}
      {!auth && <Togglable buttonName="Sign up / Login">
        <Login auth={auth} setAuth={setAuth} pushNotif={pushNotif} />
      </Togglable>}

      {auth && <NewBlog auth={auth} setBlogs={setBlogs} pushNotif={pushNotif} />}
      {auth && <Blogs auth={auth} blogs={blogs} pushNotif={pushNotif} />}
      <Notifications notifications={notifications} setNotifications={setNotifications} />
    </>
  )
}

export default App
