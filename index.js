require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const { MONGO_USER: USER, MONGO_PASSWORD: PASS, MONGO_CLUSTER: CLUSTER, MONGO_TABLE: TABLE } = process.env
const mongoUrl = `mongodb+srv://${USER}:${PASS}@${CLUSTER}.ljiec.mongodb.net/${TABLE}?retryWrites=true&w=majority&appName=${CLUSTER}`

console.log('connecting to MongoDB at ', mongoUrl)
mongoose.connect(mongoUrl)
  .then(() => { console.log(`connected to MongoDB cluster "${CLUSTER}", table "${TABLE}", as user "${USER}"`) })
  .catch(error => { console.log('error connecting to MongoDB:', error.message) })

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      console.log(`Retrieved ${blogs.length} blogs`)
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

app.delete('/api/blogs/:id', (request, response) => {
  Blog.findByIdAndDelete(request.params.id)
    .then((results) => {
      console.log('Deleted:', results)
      if (results) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})