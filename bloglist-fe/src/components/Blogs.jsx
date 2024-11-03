import { useState } from 'react';
import blogService from '../services/blogs';
import './Blogs.css';

function Blog({ auth, blog, setBlogs, pushNotif }) {
  const [expanded, setExpanded] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Delete blog "${blog.title}"?`)) {
      return
    }
    await blogService.delete(auth.tokenEncoded, blog.id)
    pushNotif({ type: 'success', message: `Deleted blog "${blog.title}"` })
    setBlogs((prevBlogs) => {
      return prevBlogs.filter(b => b.id !== blog.id)
    })
  }

  const handleLike = async () => {
    await blogService.like(auth.tokenEncoded, blog.id)
    setBlogs((prevBlogs) => {
      return prevBlogs.map(b => b.id !== blog.id ? b : { ...b, ...{ likes: b.likes + 1 } })
    }
    )
  }

  const BlogButtons = () => {
    return (
      <div className='blogButtons'>
        <button onClick={() => { setExpanded(!expanded) }}>{expanded ? 'Collapse' : 'View'}</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    )
  }

  return (
    <>
      {expanded ?
        <div className="blog expanded" key={blog.id}>
          <div className='blogTitle'>Title: {blog.title}</div>
          <div className='blogAuthor'>Author: {blog.author}</div>
          <div className='blogUrl'>URL: {blog.url}</div>
          <div className='blogLikes'>Likes: {blog.likes} <button onClick={handleLike}>like</button></div>
          <BlogButtons />
        </div >
        :
        <div className="blog collapsed" key={blog.id}>
          <div className='blogTitle'>{blog.title}</div>
          <div> - </div>
          <div className='blogAuthor'>{blog.author}</div>
          <BlogButtons />
        </div >
      }
    </>
  )
}

function Blogs({ auth, blogs, setBlogs, pushNotif }) {

  return (
    <>
      <h1 className="bloglist" >Blogs</h1>
      {blogs.map(b => <Blog auth={auth} blog={b} setBlogs={setBlogs} pushNotif={pushNotif} key={b.id} />)}
    </>
  )
}

export default Blogs