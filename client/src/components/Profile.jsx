import {React, useState, useEffect} from 'react'
import {ContentFormat} from "../Utils"
import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

function Articles({articles}) {
  if (!articles?.length) {
    return <h3 className="w3-center">No liked articles!</h3>
  }

  return (
    <div>
      {articles.reverse().map(article => (
        <div key={article.id}>
          <h3 className="w3-text-indigo"><b><a href={"/details/" + article.id}>{article.title ? (article.title) : ("[No Title]")}</a></b></h3>
            <div className="w3-row w3-opacity">
              <div className="w3-col m4 l3">
                Author: {article.userId}
              </div>
              <div className="w3-col m8 l9">
                Time: {article.createdAt.substring(0, 10) + ' ' + article.createdAt.substring(11, 19) + ' UTC'}
              </div>
            </div>
        </div>
      ))}
    </div>
  );
}

function updateNickname(user, setNickname) {
  const nicknameText = document.getElementById("displayname").value;
  const data = {"name": nicknameText};

  if (nicknameText === "") {
    alert("Nickname cannot be empty!");
    return;
  }

  fetch(REACT_APP_BACKEND_API_URL + "/nickname?user=" + user.name, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    setNickname(nicknameText);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth0();
  const [nickname, setNickname] = useState("");
  const [articles, setArticles] = useState();

  useEffect(() => {
    if (!isLoading) {
      fetch(REACT_APP_BACKEND_API_URL + "/nickname?user=" + user.name)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setNickname(data.name);
        })
        .catch(error => {
          console.error('Error:', error);
      });

      fetch(REACT_APP_BACKEND_API_URL + "/likedarticles/" + user.name)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setArticles(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }, [isLoading, isLoading?(''):(user.name)]);

  const content2 = 
    <div>
      <div className="w3-row w3-center">
        <div className="w3-col m6 l6">
          <h1 className="w3-padding-64"><b>Profile</b></h1>
        </div>
      </div>
      <div className="w3-row">
        <div className="w3-col w3-center m6 l6">
          {isLoading ? (<></>) : (<img src={user.picture} alt="pfp" width="45%"/>)}
          {isLoading ? (<></>) : (<h3 className="w3-padding-16">{nickname}</h3>)}
        </div>
        <div className="w3-container w3-margin-left w3-col m6 l6" style={{width:"350px"}}>
          <h5><b>Personal Profile</b></h5>
          <form className="w3-section">
            <label for="email">Email {isLoading ? (<></>) : (user.email_verified ? (<div className="w3-text-green">(verified)</div>) : (<div className="w3-text-red">(unverified)</div>))}</label>
            {isLoading ? (<></>) : (<input className="w3-input w3-border w3-margin-bottom" type="text" id="email" placeholder={user.name} disabled></input>)}
            <label for="displayname">Display Name</label>
            {isLoading ? (<></>) : (<input className="w3-input w3-border" type="text" id="displayname"></input>)}
            <button className="w3-button w3-right w3-blue w3-section" type="button" onClick={() => updateNickname(user, setNickname)}>Update</button>
          </form>
        </div>
      </div>
      <div className="w3-container">
        <hr></hr>
        <h4><b>Liked Articles</b></h4>
        {articles && <Articles articles={articles}/>}
      </div>
    </div>

  return (
      ContentFormat(content2)
  )
}
