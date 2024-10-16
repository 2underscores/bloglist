const logger = require('../utils/logger')

const totalLikes = (blogs) => blogs.reduce((acc, blog) => acc + blog.likes, 0)

const favoriteBlog = (blogs) => blogs.reduce((acc, blog) => acc.likes > blog.likes ? acc : blog, blogs[0])

const mostBlogs = (blogs) => {
  logger.info('Most blogs run with blogs:', blogs)

  if (blogs.length === 0) {
    return undefined
  }
  const authorBlogs = {}
  for (let blog of blogs) {
    const cur = authorBlogs[blog.author]
    authorBlogs[blog.author] = cur ? cur + 1 : 1
  }
  logger.info(authorBlogs)
  const mostAuthor = Object.keys(authorBlogs).reduce((acc, author,) => {
    return authorBlogs[author] > authorBlogs[acc] ? author : acc
  }, blogs[0].author)
  return { 'author': mostAuthor, 'blogs': authorBlogs[mostAuthor] }

}

const mostLikes = (blogs) => {
  logger.info('Most blogs run with blogs:', blogs)

  if (blogs.length === 0) {
    return undefined
  }
  const authorBlogs = {}
  for (let blog of blogs) {
    const cur = authorBlogs[blog.author]
    authorBlogs[blog.author] = cur ? cur + blog.likes : blog.likes
  }
  logger.info(authorBlogs)
  const mostAuthor = Object.keys(authorBlogs).reduce((acc, author,) => {
    return authorBlogs[author] > authorBlogs[acc] ? author : acc
  }, blogs[0].author)
  return { 'author': mostAuthor, 'likes': authorBlogs[mostAuthor] }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}