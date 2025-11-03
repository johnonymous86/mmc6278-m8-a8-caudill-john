const { Post, Tag } = require('../models')

async function create(req, res, next) {
  const {title, body, tags} = req.body
  // TODO: create a new post
  // if there is no title or body, return a 400 status
  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required' })
  }
  // omitting tags is OK
  try {
    // create a new post using title, body, and tags
    const newPost = await Post.create({ title, body, tags })
    // return the new post as json and a 200 status
    res.status(200).json(newPost)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

// should render HTML
async function get(req, res) {
  try {
    const slug = req.params.slug
    // TODO: Find a single post
    // find a single post by slug and populate 'tags'
    let post = await Post.findOne({ slug }).populate('tags').lean()
    
    if (!post) {
      return res.status(404).render('404') // Or handle a 404 appropriately
    }

    // you will need to use .lean() or .toObject() - already using .lean() above
    post.createdAt = new Date(post.createdAt).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
    post.comments.map(comment => {
      comment.createdAt = new Date(comment.createdAt).toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
      return comment
    })
    res.render('view-post', {post, isLoggedIn: req.session.isLoggedIn})
  } catch(err) {
    res.status(500).send(err.message)
  }
}

// should render HTML
async function getAll(req, res) {
  try {
    // get by single tag id if included
    const mongoQuery = {}
    if (req.query.tag) {
      const tagDoc =  await Tag.findOne({name: req.query.tag}).lean()
      if (tagDoc)
        mongoQuery.tags = {_id: tagDoc._id }
    }
    const postDocs = await Post
      .find(mongoQuery)
      .populate({
        path: 'tags'
      })
      .sort({createdAt: 'DESC'})
    const posts = postDocs.map(post => {
      post = post.toObject()
      post.createdAt = new Date(post.createdAt).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      return post
    })
    res.render('index', {
      posts,
      isLoggedIn: req.session.isLoggedIn,
      tag: req.query.tag
    })
  } catch(err) {
    res.status(500).send(err.message)
  }
}

async function update(req, res) {
  try {
    const {title, body, tags} = req.body
    const postId = req.params.id
    // TODO: update a post
    // if there is no title or body, return a 400 status
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' })
    }
    // omitting tags is OK
    // find and update the post with the title, body, and tags
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, body, tags },
      { new: true, runValidators: true } // return the new doc, run schema validators
    )

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // return the updated post as json
    res.status(200).json(updatedPost)
  } catch(err) {
    res.status(500).send(err.message)
  }
}

async function remove(req, res, next) {
  const postId = req.params.id
  // TODO: Delete a post
  try {
    // delete post by id, return a 200 status
    const deletedPost = await Post.findByIdAndDelete(postId)

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' })
    }
    
    res.status(200).json({ message: 'Post successfully deleted' })
  } catch (err) {
    res.status(500).send(err.message)
  }
}

module.exports = {
  get,
  getAll,
  create,
  update,
  remove
}