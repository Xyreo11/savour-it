const mongoose = require("mongoose");

const likedRecipesSchema = new mongoose.Schema({
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
    ref: "User",
    required: true,
  },
  recipe_obj_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe", // Reference to the Recipe schema
    required: true,
  },
});

// Avoid OverwriteModelError
const LikedRecipe = mongoose.models.LikedRecipe || mongoose.model("LikedRecipe", likedRecipesSchema);

module.exports = LikedRecipe;


