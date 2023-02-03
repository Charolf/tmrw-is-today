import {React, useState, useEffect} from 'react'
import {ContentFormat, SidebarCombiner} from "../Utils"

const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

function Articles({articles}) {
  if (!articles?.length) {
    return <h2 className="w3-col w3-margin-left w3-margin-right w3-center m8 l8">No articles!</h2>
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

export default function Home() {
  const [articles, setArticles] = useState();

  useEffect(() => {
    fetch(REACT_APP_BACKEND_API_URL + "/articles")
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
    })}, []);

  const content = 
    <div className="w3-col w3-margin-left w3-margin-right m8 l8">
      {articles && <Articles articles={articles}/>}
    </div>

  return (
    ContentFormat(SidebarCombiner(content))
  );
}
