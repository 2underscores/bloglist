
function Blog(blog) {
  const blogStr = `${blog.title} - ${blog.author} - ${blog.url}`
  return (
    <div key={blogStr}>{blogStr}</div>
  )
}

function Blogs({ blogs }) {
  return (
    <>
      <h1>Blogs</h1>
      {blogs.map(b => Blog(b))}
    </>
  )
}

export default Blogs