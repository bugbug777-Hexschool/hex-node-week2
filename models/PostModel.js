const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  // Data Schema
  {
    tags: [
      {
        type: String,
        required: [true, '貼文標籤為必填']
      }
    ],
    type: {
      type: String,
      enum: ['group', 'person']
    },
    name: {
      type: String,
      required: [true, "貼文名稱為必填"]
    },
    content: {
      type: String,
      required: [true, '貼文內容為必填']
    },
    image: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false
  }
);

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;