import React, { useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

function postNickname(user) {
  const data = {
    "name": user.nickname,
    "userId": user.name
  }

  fetch(REACT_APP_BACKEND_API_URL + "/nickname", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((data) => {
  })
  .catch((error) => {
    console.error("Error:", error);
  });
};

export default function VerifyUser() {
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();
  const { user } = useAuth0();

  useEffect(() => {
    async function verifyUser() {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/verify-user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const user_data = await data.json();

      if (user_data.auth0Id) {
        navigate("/");
      }
    }
    
    if (accessToken) {
      postNickname(user);
      navigate("/");
    }
  }, [accessToken, navigate, user]);

  return <div className="loading">Loading...</div>;
}