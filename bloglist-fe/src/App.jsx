import CryptoJS from 'crypto-js';
import { useEffect, useRef, useState } from "react";
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
  const [blogs, setBlogs_] = useState([])
  const [notifications, setNotifications] = useState([])

  // Centralised sort. Somewhat ugly, should probably be customHook
  const setBlogs = (newBlogs) => {
    if (typeof newBlogs === 'function') {
      setBlogs_((prevBlogs) => {
        const updatedBlogs = newBlogs(prevBlogs);
        return [...updatedBlogs].sort((a, b) => b.likes - a.likes);
      });
    } else {
      setBlogs_([...newBlogs].sort((a, b) => b.likes - a.likes));
    }
  };

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
    setTimeout(() => {
      setNotifications((preNotifs) => preNotifs.filter(n => n.id !== id))
    }, 3000)
  }

  // Allow create note to collapse it's own paren't toggle
  const newNoteToggleRef = useRef(null)

  return (
    <>
      {!auth ?
        <Togglable buttonName="Sign up / Login">
          <Login auth={auth} setAuth={setAuth} pushNotif={pushNotif} />
        </Togglable>
        :
        <>
          <Logout auth={auth} setAuth={setAuth} pushNotif={pushNotif} />
          <Togglable buttonName="New Blog" ref={newNoteToggleRef}>
            <NewBlog auth={auth} setBlogs={setBlogs} parentToggle={newNoteToggleRef} pushNotif={pushNotif} />
          </Togglable>
          <Blogs auth={auth} blogs={blogs} setBlogs={setBlogs} pushNotif={pushNotif} />
        </>
      }
      <Notifications notifications={notifications} setNotifications={setNotifications} />
    </>
  )
}

export default App
