const { Thought, User } = require('../models');

//routes's functions for Thought collection
module.exports = {
    // Get all thoughts
    async getThoughts(req, res) {
      try {
        const thoughts = await Thought.find()
        .select('-__v');

        //console.log(thoughts[0].createdAt, typeof thoughts[0].createdAt);
         res.json(thoughts);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // Get a single thought
    async getSingleThought(req, res) {
      try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this ID to display' })
        }
  
        res.json(thought);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },

    // create a new thought
    async createThought(req, res) {
      try {
        //create a thought
        const thought = await Thought.create(req.body);

        //add thought ID to the User (to thoughts ID array)
        const user = await User.findOneAndUpdate(
          { username: req.body.username },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        )
        .select('-__v');
  
        if (!user) {
          return res.status(404).json({
            message: 'Thought created, but found no user with this ID to add this thought to',
          })
        }
  
        res.json(thought);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },

    // update a thought
    async updateThought(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { 
            runValidators: true, 
            new: true 
          }
        ).select('-__v');
  
        if (!thought) {
          return res.status(404).json({ message: 'No Thought with this ID to update!' });
        }
  
        res.json(thought);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },

    // delete a thought
    async deleteThought(req, res) {
      try {
        // delete a thought by ID from Thought model
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
  
        if (!thought) {
          return res.status(404).json({ message: 'No Thought with this ID to delete!' });
        }
        
        // find a user with thought ID in thughts array from URL and then delete this thought from this array (update User model so it will not have refference to deleted thought)
        const user = await User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
  
        if (!user) {
          return res.status(404).json({
            message: 'Thought was deleted but no user with this thought-ID to delete this thought from!',
          });
        }
  
        res.json({ message: 'Thought successfully deleted!' });
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // create Reaction
    async addReaction(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: req.body } },
          { runValidators: true, new: true }
        ).select('-__v');
  
        if (!thought) {
          return res.status(404).json({ message: 'No Thought found with this ID to add a reaction to!' });
        }
  
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },

    // remove Reaction
    async removeReaction(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { 
            runValidators: true, 
            new: true }
        ).select('-__v');
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this ID to delete reaction from!' });
        }
  
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },
};