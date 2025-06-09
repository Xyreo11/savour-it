import React, { useState } from "react";
import "../styles/Addrecipe.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRecipe = () => {
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [""],
    instructions: "",
    imageUrl: "",
    filter: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe({
      ...recipe,
      [name]: value,
    });
  };

  const handleAddIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, ""],
    });
  };

  const handleIngredientChange = (e, index) => {
    const newIngredients = recipe.ingredients.map((ingredient, i) =>
      i === index ? e.target.value : ingredient
    );
    setRecipe({
      ...recipe,
      ingredients: newIngredients,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(recipe),
      });

      if (response.ok) {
        toast.success("Recipe added successfully");
        setRecipe({
          title: "",
          description: "",
          ingredients: [""],
          instructions: "",
          imageUrl: "",
          filter: "",
        });
      } else {
        toast.error("Failed to add recipe");
      }
    } catch (error) {
      toast.error("An error occurred while adding the recipe");
    }
  };

  return (
    <div className="add-recipe">
      <h2>Add Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={recipe.title}
          onChange={handleInputChange}
          required
        />
        <label>Description:</label>
        <textarea
          name="description"
          value={recipe.description}
          onChange={handleInputChange}
          required
        />
        <label>Ingredients:</label>
        {recipe.ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            value={ingredient}
            onChange={(e) => handleIngredientChange(e, index)}
            required
          />
        ))}
        <button type="button" onClick={handleAddIngredient}>
          Add Ingredient
        </button>
        <label>Instructions:</label>
        <textarea
          name="instructions"
          value={recipe.instructions}
          onChange={handleInputChange}
          required
        />
        <label>Image URL:</label>
        <input
          type="text"
          name="imageUrl"
          value={recipe.imageUrl}
          onChange={handleInputChange}
          required
        />
        <label>Filter:</label>
        <select
          name="filter"
          value={recipe.filter}
          onChange={handleInputChange}
          required
        >
          <option value="">Select</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
        <button type="submit">Add Recipe</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddRecipe;