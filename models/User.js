const { Schema, model } = require('mongoose');
const thoughtModel = require('./Thought');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address.'],
    },
    thoughts: [
      {
      type: Schema.Types.ObjectId,
      ref: thoughtModel,
      // ref: 'thought'
      },
    ],  
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
    ],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

// create virtuals
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

//create User model
const User = model('user', userSchema);



module.exports = User;