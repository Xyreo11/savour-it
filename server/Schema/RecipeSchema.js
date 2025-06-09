const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: [String],
  instructions: {
    type: String,
    required: true,
  },
  imageUrl: String,
  filter: {
    type: String,
    enum: ["veg", "non-veg"],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
});

// Avoid OverwriteModelError
const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
