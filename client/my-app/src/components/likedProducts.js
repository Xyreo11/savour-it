import React, { useEffect, useState } from "react";
import "../styles/likedProducts.css";

const LikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  const fetchLikedProducts = async () => {
    try {
      setLoading(true); // Show loading while fetching data
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/auth/likedRecipes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the token is correctly formatted
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLikedProducts(data);
        setError(null); // Clear any previous errors
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch liked products.");
      }
    } catch (error) {
      console.error("An error occurred while fetching liked products:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Hide loading after fetch completes
    }
  };

  return (
    <div className="likedRecipes">
      <h2>Liked Recipes</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : likedProducts.length > 0 ? (
        <ul>
          {likedProducts.map((product) => (
            <li key={product._id} >
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              {product.imageUrl && (
                <div className="imgcont">
                <img src={product.imageUrl} alt={product.title} />
                </div>
             
                
              )}
              <ol className="inglist">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ol>
              <p>Type: {product.filter}</p>
              <div className="
              rect"></div>
              <br></br> <br></br> <br></br>
            </li>
          ))}
       
        </ul>
      ) : (
        <p>No liked recipes found</p>
      )}
    </div>
  );
};

export default LikedProducts;
