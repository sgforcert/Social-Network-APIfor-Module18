const { User, Thought } = require('../models');

//routes's functions for User collection
module.exports = {
    // Get all users
    async getUsers(req, res) {
      try {
        const users = await User.find()
        .select('-__v');
   
        res.json(users);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // Get a single user
    async getSingleUser(req, res) {
      try {
        const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');
  
        if (!user) {
          return res.status(404).json({ message: 'No user with this ID to display' })
        }
  
        res.json(user);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // create a new user
    async createUser(req, res) {
      try {
        const user = await User.create(req.body);
        res.json(user);
        //res.json('a new User was created');
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // update a user
    async updateUser(req, res) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body },
          { 
            runValidators: true, 
            new: true }
        )
        .select('-__v');
  
        if (!user) {
          return res.status(404).json({
            message: 'No user with this ID to update',
          })
        }
  
        res.json(user);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },

    // delete a user
    async deleteUser(req, res) {
      try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });

        const usernameDel = user.username;

        await Thought.deleteMany({
          username: usernameDel
        });
  
        if (!user) {
          return res.status(404).json({ message: 'No user with this ID to delete' });
        }
  
        res.json({ message: 'User successfully deleted' });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },

    // add Friend
    async addFriend(req, res) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: { _id: req.body.friendId } } },
          { 
            runValidators: true, 
            new: true 
          }
        ).select('-__v');
  
        if (!user) {
          return res.status(404).json({ message: 'No User found with this ID to add a friend to!' });
        }
  
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // remove Friend
    async removeFriend(req, res) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends:  req.params.friendId  } },
          { 
            runValidators: true, 
            new: true }
        ).select('-__v');
  
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID to delete friend from!' });
        }
  
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
};