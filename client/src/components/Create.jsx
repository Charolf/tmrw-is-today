import React from 'react'
import {ContentFormat, SidebarCombiner} from "../Utils"
import { useAuth0 } from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

function getTitleAndContent(userName, navigate) {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (title === "" || content === "") {
    alert("Title or content cannot be empty!");
    return;
  }
  
  const data = {"title": title,
                "content": content,
                "userId": userName};

  postAnArticle(data, navigate);
}

function postAnArticle(newArticle, navigate) {
  fetch(REACT_APP_BACKEND_API_URL + "/article", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newArticle),
  })
  .then((response) => response.json())
  .then((data) => {
    alert("Article created successfully!");
    navigate("/");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
};

export default function Create() {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const content =
    <div className="w3-col w3-margin-left m8 l8">
      <div className="w3-container">
        <h2><b>Create a new article</b></h2>
      </div>
      <form className="w3-container">
        <div className="w3-section">
          <input className="w3-input w3-border w3-margin-bottom" type="text" placeholder="Title" id="title" required></input>
          <textarea className="w3-input w3-border w3-margin-bottom" type="text" placeholder="Content" id="content" style={{height: "350px"}} required></textarea>
          <button className="w3-button w3-right w3-green w3-section" type="button" onClick={() => getTitleAndContent(user.name, navigate)}>Submit</button>
        </div>
      </form>
    </div>

  return (
    ContentFormat(SidebarCombiner(content))
  )
}
