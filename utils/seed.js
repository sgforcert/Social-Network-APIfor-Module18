const connection = require('../config/connection');
const { User, Thought } = require('../models');

// user seeds data for User Model
const userData = [
  {
    username: 'Sally',
    email: "sally@uofu.com",
    thoughts: [],
    friends: []
  },
  {
    username: 'Matt',
    email: "matt@uofu.com",
    thoughts: [],
    friends: []
  },
  {
    username: 'Owen',
    email: "owen@uofu.com",
    thoughts: [],
    friends: []
  },
];

// user thoughts and reactions data for Thought Model
const thoughtData = [
  {
    thoughtText: 'Follow the white rabbit',
    username: 'Matt',
    reactions: [
      {
        reactionBody: 'like it!',
        username: 'Owen'
      },
      {
        reactionBody: 'What do you mean?',
        username: 'Sally'
      },
    ]
  },
  {
    thoughtText: 'Matrix is cool!',
    username: 'Owen',
    reactions: [
      {
        reactionBody: 'agree!',
        username: 'Matt'
      },
      {
        reactionBody: 'I still can not get you, gyus :(',
        username: 'Sally'
      },
    ]
  },
  {
    thoughtText: 'I can code!!!',
    username: 'Matt',
    reactions: [
      {
        reactionBody: 'Geate!',
        username: 'Owen'
      },
      {
        reactionBody: 'Congrats!!! :)))))',
        username: 'Sally'
      },
      {
        reactionBody: 'Keep working! Do not stop!',
        username: 'Owen'
      },
    ]
  },
  {
    thoughtText: 'I am working on a new project!',
    username: 'Sally',
    reactions: [
      {
        reactionBody: 'Cool! Can I join?',
        username: 'Matt'
      },
      {
        reactionBody: 'What is it about?',
        username: 'Owen'
      },
    ]
  },
];

// Seeding
connection.once('open', async () => {

  // Drop the collections if they exist
  // User Collection
  let usersCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (usersCheck.length) {
    await connection.dropCollection('users');
  };
  // Thought Collection
  let thoughtsCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (thoughtsCheck.length) {
    await connection.dropCollection('thoughts');
  };

  // seed the User Collection
  await User.insertMany(userData);
  console.log('Users inserted');

  // seed the Thought Collection
  const thoughtResults = await Thought.insertMany(thoughtData);

  // seed the thought array in the User Collection with the thoughts-id data from the Thought Collection
  for (let i = 0; i < thoughtResults.length; i++) {
    let updateUser = await User.findOneAndUpdate(
      { username: thoughtResults[i].username },
      { $addToSet: { thoughts: thoughtResults[i]._id } },
      { new: true }
    ).select('-__v');
    console.log('User updated with thought-data', updateUser);
  };

process.exit(0);
});