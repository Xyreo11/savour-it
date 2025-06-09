import React, { useEffect, useState, useRef } from "react";
import "../styles/RecipeStyle.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [filter, setFilter] = useState(""); // State for filter
  const expandedCardRef = useRef(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    getUserId();
    getRecipes();
    getLikedRecipes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedCardRef.current && !expandedCardRef.current.contains(event.target)) {
        setExpandedRecipeId(null);
      }
    };

    if (expandedRecipeId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandedRecipeId]);

  const getRecipes = () => {
    fetch("http://localhost:5000/auth/recipe", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch recipe data");
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getLikedRecipes = () => {
    fetch("http://localhost:5000/auth/likedRecipes", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch liked recipes");
        }
        return response.json();
      })
      .then((data) => {
        setLikedRecipes(data.map((recipe) => recipe.recipeId));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        const response = await fetch(
          `http://localhost:5000/auth/recipe/${recipeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          toast.success("Recipe deleted successfully");
          setTimeout(() => {
            window.location = "/recipes";
          }, 1000);
        } else {
          getRecipes();
          window.location = "/recipes";
        }
      }
    } catch (error) {
      toast.error("An error occurred while deleting the recipe:", error);
      setTimeout(() => {
        window.location.href = "/recipes";
      }, 3000);
    }
  };

  const handleAddToFavorites = async (recipeId) => {
    if (likedRecipes.includes(recipeId)) {
      toast.warn("Recipe already exists in your favorites");
      return;
    }

    try {
      console.log("test");
      
      const response = await fetch(
        `http://localhost:5000/auth/likedRecipes/${recipeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Recipe added to favorites successfully");
        // setTimeout(() => {
        //   window.location.href = "/favouriteRecipes";
        // }, 4000);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to add to favorites");
      }
    } catch (error) {
      console.error("An error occurred while adding to favorites:", error);
    }
  };

  const SearchRecipes = async (e) => {
    try {
      if (e.target.value) {
        let Searchedrecipes = await fetch(
          `http://localhost:5000/auth/searchRecipes/${e.target.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        Searchedrecipes = await Searchedrecipes.json();

        if (!Searchedrecipes.message) {
          setRecipes(Searchedrecipes);
        } else {
          setRecipes([]);
        }
      } else {
        getRecipes();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleCardClick = (recipeId) => {
    setExpandedRecipeId(recipeId);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const token = localStorage.getItem("token");

  const getUserId = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/getUserId", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserId(data.userId); // Store the userId in the state
        console.log(userId);
        
      } else {
        throw new Error("Failed to get user ID");
      }
    } catch (error) {
      console.error(error);
    }
  };


  // const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
  // console.log(userId);
  // console.log(token)

  //REMOVE


  const filteredRecipes = filter
    ? recipes.filter((recipe) => recipe.filter === filter)
    : recipes;

 
  return (
    <div className="Recipes">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes"
          onChange={(e) => SearchRecipes(e)}
        />
        <select className="filter-select" value={filter} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
      </div>

      {filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe) => (
          <div
            key={recipe._id}
            className={`Recipe ${expandedRecipeId === recipe._id ? "expanded" : ""}`}
            onClick={() => handleCardClick(recipe._id)}
            ref={expandedRecipeId === recipe._id ? expandedCardRef : null}
          >
            <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
            <h2>{recipe.title}</h2>
            {expandedRecipeId === recipe._id && (
              <div className="recipe-details">
                <h3>Description:</h3>
                <p>{recipe.description}</p>
                <h3>Ingredients:</h3>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <h3>Instructions:</h3>
                <div className="instructions-container">
                  {recipe.instructions.split("\n").map((step, index) => (
                    <p key={index}>{step}</p>
                  ))}
                </div>
                <h3>Filter:</h3>
                <p>{recipe.filter}</p>
                {console.log(`Recipe user ID: ${recipe.userId}`)}
                {console.log(`Recipe user ID: ${userId}`)}
                {recipe.userId === userId && (
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecipe(recipe._id);
                    }}
                  >
                    Delete
                  </button>
                )}
                <button
                  className="add-to-favorites-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToFavorites(recipe._id);
                  }}
                  disabled={likedRecipes.includes(recipe._id)}
                >
                  {likedRecipes.includes(recipe._id) ? "In Favorites" : "Add to Favorites"}
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <h2 className="no-recipes">No Recipes Found</h2>
      )}
      <ToastContainer />
    </div>
  );
};

export default Recipes;