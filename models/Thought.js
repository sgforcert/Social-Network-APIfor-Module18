const { Schema, model, Types } = require('mongoose');
const { formatDate } = require('../utils');

// Schema to create Reaction subdocument
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId() 
    },
    reactionBody: {
      type: String,
      required: true,
      minlength: 1, 
      maxlength: 280 
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date, 
      default: Date.now,
      get: function(time) {
        return formatDate(time);
      }
    },
  },
  {
    toJSON: {
      getters: true,
    },
    _id: false,
  }
);

// Schema to create Thought model 
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1, 
      maxlength: 280 
    },
    createdAt: {
      type: Date, 
      default: Date.now,
      get: function(time) {
        return formatDate(time);
      }
    },
    username: {
      type: String,
      required: true,
    }, 
    reactions: [
      reactionSchema
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
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

//create Thought model
const Thought = model('thought', thoughtSchema);



module.exports = Thought;