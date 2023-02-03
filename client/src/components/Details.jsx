import {React, useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {ContentFormat, SidebarCombiner} from "../Utils"
import {useAuth0} from "@auth0/auth0-react";

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

function setALike(articleId, userId, likeColor, setLikeColor) {
  const data = {
    "articleId": articleId,
    "auId": userId + articleId,
    "userId": userId
  }

  if (likeColor === "silver") {
    fetch(REACT_APP_BACKEND_API_URL + "/like", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify(data)})
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      setLikeColor("gold");
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  else {
    fetch(REACT_APP_BACKEND_API_URL + "/like", {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify(data)})
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      setLikeColor("silver");
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
}

function deleteArticle(id, navigate) {
  fetch(REACT_APP_BACKEND_API_URL + "/article/" + id, {method: "DELETE"})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    alert("Article successfully deleted!");
    navigate("/");
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

function Article({article, navigate}) {
  const { user, isLoading } = useAuth0();
  const [likeColor, setLikeColor] = useState("silver");

  useEffect(() => {
    if (!isLoading) {
      fetch(REACT_APP_BACKEND_API_URL + "/like/" + user.name + article.id, {method: "GET"})
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data) {
          setLikeColor("silver");
        }
        else {
          setLikeColor("gold");
        }
      })
      .catch(error => {
        console.error('Error:', error);
      })
    }
  }, [user, article.id, isLoading]);

  return (
    <div className="w3-col w3-margin-left w3-margin-right m8 l8">
      <h2><b>{article.title ? (article.title) : ("[No Title]")}</b></h2>
      <div className="w3-row w3-opacity">
        <div className="w3-col m5 l4">
          Author: {article.userId}
        </div>
        <div className="w3-col m7 l8">
          Time: {article.createdAt.substring(0, 10) + ' ' + article.createdAt.substring(11, 19) + ' UTC'}
        </div>
      </div>
      <br></br>
      {isLoading ? (<></>) : (article.userId === user.name ? (<button className="w3-button w3-red" type="submit" onClick={() => deleteArticle(article.id, navigate)}>Delete</button>) : (<></>))}
      {isLoading ? (<></>) : (<i className="w3-right w3-button w3-circle w3-border-0 w3-hover-none material-icons" style={{color: likeColor}} onClick={() => setALike(article.id, user.name, likeColor, setLikeColor)}>thumb_up</i>)}
      <br></br><hr></hr>
      <p>{article.content}</p>
    </div>
  );
}

export default function Details() {
  const [article, setArticle] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(REACT_APP_BACKEND_API_URL + "/article/" + id)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setArticle(data);
    })
    .catch(error => {
      console.error('Error:', error);
    })}, [id]);

  const content = <div>{article && <Article article={article} navigate={navigate}/>}</div>
    
  return (
    ContentFormat(SidebarCombiner(content))
  )
}
