import { useState } from "react";
import blogService from '../services/blogs';

function NewBlog({ auth, setBlogs, pushNotif, parentToggle }) {

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
    try {
      const createdBlog = await blogService.create(auth.tokenEncoded, newBlog)
      console.log('Created blog: ', createdBlog);
      setBlogs((prev) => [...prev, createdBlog])
      parentToggle.current.toggleSelf()
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    } catch (e) {
      console.error(e)
      pushNotif({ type: 'error', message: e.response.data.error })
    }
  }

  return (
    <>
      <h2>New Blog</h2>
      <form onSubmit={handleSubmit} style={{ 'display': 'flex', 'flexDirection': 'column', 'gap': '5px', }}>
        <span>Title: <input type="text" value={newTitle} name='newTitle' onChange={(evt) => { setNewTitle(evt.target.value) }}></input></span>
        <span>Author: <input type="text" value={newAuthor} name='newAuthor' onChange={(evt) => { setNewAuthor(evt.target.value) }}></input></span>
        <span>URL: <input type="text" value={newUrl} name='newUrl' onChange={(evt) => { setNewUrl(evt.target.value) }}></input></span>
        <button type='submit'>Create</button>
      </form>
    </>
  )
}

export default NewBlog