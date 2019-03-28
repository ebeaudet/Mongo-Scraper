var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var CommentsSchema = new Schema({
  // `title` is required and of type String
  comment: {
    type: String,
    required: true
  },
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentsSchema);

// Export the Article model
module.exports = Comment;