const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  LikedList,
  getAllLikedRecipes,
  removeFromLikedRecipes,
  searchRecipes,
} = require("../controllers/RecipeController");
const verifyToken = require("../Middleware/middleware");

router.post("/recipe", verifyToken, createRecipe);
router.get("/recipe", verifyToken, getAllRecipes);
router.get("/likedRecipes", verifyToken, getAllLikedRecipes);
router.delete("/recipe/:id", verifyToken, deleteRecipe);
router.post("/likedRecipes/:id", verifyToken, LikedList);
router.delete("/removeLiked/:id", verifyToken, removeFromLikedRecipes);
router.get("/searchRecipes/:key", verifyToken, searchRecipes);

router.get("/getUserId", verifyToken, (req, res) => { //new
  res.json({ userId: req.userId });
});

module.exports = router;