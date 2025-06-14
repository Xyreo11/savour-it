import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const LogoutUser = () => {
    if (window.confirm("You wanna logout?")) {
      localStorage.clear();
      window.location.href = "/login";
    } else {
      window.location.href = "/recipes";
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const auth = localStorage.getItem("token");

  const handleToggleMenu = () => {
    setIsOpen(false);
  };
   
  const navigate = useNavigate();

  return (
    <div className="navbar-container">
      <nav className="green-navbar">
        <div className="nav-left">
          <FontAwesomeIcon
            icon={faBars}
            className="hamburger-icon"
            onClick={toggleMenu}
            style={isOpen ? { transform: "rotate(90deg)", transition: "transform 0.3s ease" } : { transition: "transform 0.3s ease" }}
          />

          <h2 onClick={()=>navigate("/")}>Savour It!!</h2>
        </div>
        <div className={`nav-right ${isOpen ? "open" : ""}`}>
          <ul>
            {auth ? (
              <>
                <li>
                  <NavLink to="recipes" onClick={handleToggleMenu}>
                    Recipes
                  </NavLink>{" "}
                </li>

                <li>
                  <NavLink to="/addRecipe" onClick={handleToggleMenu}>
                    Add Recipe
                  </NavLink>{" "}
                </li>
                <li>
                  <NavLink to="/favouriteRecipes" onClick={handleToggleMenu}>
                    Favourites
                  </NavLink>{" "}
                </li>
                <li>
                  <NavLink to="login" onClick={LogoutUser}>
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="login">Login</NavLink>{" "}
                </li>
                <li>
                  <NavLink to="signup">SignUp</NavLink>
                </li>
                <li>
                  <NavLink to="forgotPassword">Forgot Password</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;