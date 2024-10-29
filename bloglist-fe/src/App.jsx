import { useState } from "react";
import Login from './components/login';

function App() {
  // const [blogs, setBlogs] = useState([])
  // const [newBlog, setNewBlog] = useState({ 'url': '', 'title': '', 'author': ''})
  const [user, setUser] = useState(null)



  return (
    <>
      <Login user={user} setUser={setUser} />
    </>
  )
}

export default App
