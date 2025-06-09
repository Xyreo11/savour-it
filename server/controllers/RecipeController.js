const LikedRecipe = require("../Schema/LikedRecipeSchema");
const Recipe = require("../Schema/RecipeSchema");

const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, imageUrl, filter } = req.body;

    if (!filter || !["veg", "non-veg"].includes(filter)) {
      return res.status(400).json({ error: "Filter must be either 'veg' or 'non-veg'" });
    }

    const newRecipe = await Recipe.create({
      title,
      description,
      ingredients,
      instructions,
      imageUrl,
      filter,
      userId: req.token._id, // Ensure userId is passed correctly
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    res.status(200).json(allRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the user is the creator of the recipe
    if (recipe.userId.toString() !== req.token._id) {
      return res.status(403).json({ error: "You are not authorized to delete this recipe" });
    }

    await Recipe.findByIdAndDelete(id);
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const LikedList = async (req, res) => {
  try { 
    const { id } = req.params; // Recipe ID
    const recipe = await Recipe.findById(id);
    console.log("Hi")
    console.log(`Existing recipe id: ${recipe._id}`);
    console.log(`User id: ${req.userId}`);
    

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the recipe is already in the user's favorites
    const existingLikedRecipe = await LikedRecipe.findOne({ 
      recipe_obj_id: recipe._id, // Use the new `recipe_obj_id` field
      userId: req.userId
    });
    console.log(req.userId);
    
    if (existingLikedRecipe) {
      return res.status(400).json({ error: "Recipe already exists in your favorites" });
    }

    const likedRecipe = await LikedRecipe.create({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      imageUrl: recipe.imageUrl,
      filter: recipe.filter,
      userId: req.token._id,
      recipe_obj_id: recipe._id, // Save the original Recipe `_id`
    });

    res.status(201).json(likedRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllLikedRecipes = async (req, res) => {
  try {
    const likedRecipes = await LikedRecipe.find({ userId: req.token._id });
    res.status(200).json(likedRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const removeFromLikedRecipes = async (req, res) => {
  try {
    const { id } = req.params;
    await LikedRecipe.findOneAndDelete({ recipeId: id, userId: req.token._id });
    res.status(200).json({ message: "Recipe removed from liked recipes" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const searchRecipes = async (req, res) => {
  try {
    const { key } = req.params;
    const recipes = await Recipe.find({ title: { $regex: key, $options: "i" } });
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  deleteRecipe,
  LikedList,
  getAllLikedRecipes,
  removeFromLikedRecipes,
  searchRecipes,
};