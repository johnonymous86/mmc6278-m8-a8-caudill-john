const { Schema, model, SchemaTypes, models } = require('mongoose');
const CommentSchema = require('./Comment');

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  comments: [CommentSchema],
  tags: [{
    type: SchemaTypes.ObjectId,
    ref: 'Tag'
  }],
  
  slug: {
    type: String
  }
});

// Turns first five words of title and lowercase
// and joins them on hypens.
PostSchema.pre('save', async function(next) {
  this.slug = this.title
    .split(' ')
    .slice(0, 5)
    .join('-')
    .toLowerCase()
    .replace(/[',.*\?\!\\\$@;:"]/g, ""); 
  next();
});

module.exports = models.Post || model('Post', PostSchema);
