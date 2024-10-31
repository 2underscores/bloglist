
function Blog(blog) {
  const blogStr = `${blog.title} - ${blog.author} - ${blog.url}`
  return (
    <div key={blog.id}>{blogStr}</div>
  )
}

function Blogs({ blogs, pushNotif }) {

  return (
    <>
      <h1>Blogs</h1>
      {blogs.map(b => Blog(b))}
    </>
  )
}

export default Blogs