import CryptoJS from 'crypto-js';
import { useEffect, useState } from "react";
import Blogs from './components/Blogs';
import Login from './components/Login';
import Notifications from "./components/Notifications";
import blogService from './services/blogs';

function App() {
  // const [blogs, setBlogs] = useState([])
  // const [newBlog, setNewBlog] = useState({ 'url': '', 'title': '', 'author': ''})
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notifications, setNotifications] = useState([])

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
  const initialNotifs = [ // id and time added
    { type: 'error', message: 'Test error1' },
    { type: 'error', message: 'Test error2' },
    { type: 'success', message: 'Test success1' },
    { message: 'unknown type notif' },
  ]
  useEffect(() => {
    setNotifications([])
    initialNotifs.forEach((n) => pushNotif(n))
  }, [])

  // Try retrieve logged in user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON))
    }
  }, [])

  // Reload blogs everytime user changes
  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
      blogService
        .list()
        .then(bgs => setBlogs(bgs))
    } else {
      // No user
      setBlogs([])
    }
  }, [user])

  return (
    <>
      <Login user={user} setUser={setUser} pushNotif={pushNotif} />
      <Blogs blogs={blogs} user={user} />
      <Notifications notifications={notifications} setNotifications={setNotifications} />
    </>
  )
}

export default App
