import {React, useState} from 'react'
import {ContentFormat, SidebarCombiner} from "../Utils"

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

function getSearchValue(setArticles, setSearchValue) {
  const searchValue = document.getElementById("query").value;

  if (searchValue === "") {
    alert("Search cannot be empty!");
    return;
  }

  fetch(REACT_APP_BACKEND_API_URL + "/search?criteria=" + searchValue)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    setArticles(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

  window.history.replaceState(null, null, "?criteria=" + searchValue);
  setSearchValue(searchValue);
}

function Articles({articles}) {
  if (!articles?.length) {
    return <h2 className="w3-col w3-margin-left w3-margin-right w3-center m8 l8">No articles found!</h2>
  }

  return (
    <div>
      {articles.reverse().map(article => (
        <div key={article.id}>
          <h3 className="w3-text-indigo"><b><a href={"/details/" + article.id}>{article.title ? (article.title) : ("[No Title]")}</a></b></h3>
          <div className="w3-row w3-opacity">
            <div className="w3-col m5 l4">
              Author: {article.userId}
            </div>
            <div className="w3-col m7 l8">
              Time: {article.createdAt.substring(0, 10) + ' ' + article.createdAt.substring(11, 19) + ' UTC'}
            </div>
          </div>
          <hr></hr>
        </div>
      ))}
    </div>
  );
}

export default function Search() {
  const [articles, setArticles] = useState();
  const [searchValue, setSearchValue] = useState();

  const content = 
    <div className="w3-col w3-margin-left w3-margin-right m8 l8">
      <div className="w3-container">
        <h2><b>Search</b></h2>
        <h6 className="w3-margin-bottom">(Title only)</h6>
      </div>
      <form className="w3-container w3-margin-top w3-margin-bottom">
        <div className="w3-row">
          <div className="w3-col s9 m9 l10">
            <input className="w3-input w3-border" type="text" placeholder="What do you want to know?" id="query" required></input>
          </div>
          <div className="w3-col s3 m3 l2">
            <button className="w3-button w3-right w3-green" type="button" name="criteria" value={searchValue} onClick={() => getSearchValue(setArticles, setSearchValue)}>Submit</button>
          </div>
        </div>
      </form>
      <div className="w3-container w3-margin-top">
        {articles && <Articles articles={articles}/>}
      </div>
    </div>

  return (
    ContentFormat(SidebarCombiner(content))
  );
}
