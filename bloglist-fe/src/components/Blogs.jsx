import './Blogs.css'

function Blog(blog) {
  const blogStr = `${blog.title} - ${blog.author} - ${blog.url}`
  return (
    <div className="blog" key={blog.id}>{blogStr}</div>
  )
}

function Blogs({ blogs, pushNotif }) {

  return (
    <>
      <h1 className="bloglist" >Blogs</h1>
      {blogs.map(b => Blog(b))}
    </>
  )
}

export default Blogs