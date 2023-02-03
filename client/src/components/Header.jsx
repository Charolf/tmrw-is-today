import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
//import { useNavigate } from "react-router-dom";

export default function Header() {
  const { isAuthenticated, loginWithRedirect, isLoading, logout } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });
  const logoff = () => logout({returnTo: window.location.origin});
  
  return (
    <div className="w3-top">
      <div className="w3-top w3-bar w3-light-grey">
        <a href="/" className="w3-bar-item w3-button"><b>Home</b></a>
        {isLoading ? (<></>) : 
          (!isAuthenticated ? (
            <div>
              <button className="w3-bar-item w3-button w3-blue w3-right" onClick={signUp}>Register</button>
              <button className="w3-bar-item w3-button w3-green w3-right" onClick={loginWithRedirect}>Login</button>
            </div>
          ) : (
            <div>
              <button className="w3-bar-item w3-button w3-gray w3-right" onClick={logoff}>Logout</button>
              <a href="/profile" className="w3-bar-item w3-button w3-amber w3-right">Profile</a>
              <a href="/search" className="w3-bar-item w3-button w3-light-blue w3-right">Search</a>
              <a href="/create" className="w3-bar-item w3-button w3-pale-red w3-right">Post</a>
            </div>
          )
        )}
      </div>
    </div>
  )
}
