import CryptoJS from 'crypto-js';
import { useEffect, useState } from "react";
import Login from './components/Login';
import Notifications from "./components/Notifications";

function App() {
  // const [blogs, setBlogs] = useState([])
  // const [newBlog, setNewBlog] = useState({ 'url': '', 'title': '', 'author': ''})
  const [user, setUser] = useState(null)
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

  const initialNotifs = [ // id and time added
    { type: 'error', message: 'Test error1' },
    { type: 'error', message: 'Test error2' },
    { type: 'success', message: 'Test success1' },
  ]
  useEffect(() => { // Dev/test item
    setNotifications([])
    initialNotifs.forEach((n) => pushNotif(n))
  }, [])

  return (
    <>
      <Login user={user} setUser={setUser} pushNotif={pushNotif} />
      <Notifications notifications={notifications} setNotifications={setNotifications} />
    </>
  )
}

export default App
