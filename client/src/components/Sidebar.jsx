import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";

export default function Sidebar() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <div className="w3-col w3-border-left w3-padding-18 m3 l3">
      <div className="w3-margin-left">
        {isLoading ? (<></>) : (isAuthenticated ? (<div><h4>Welcome,</h4>{user.nickname+'!'}</div>) : (<div><h4>Welcome,</h4>guest!</div>))}
        <div className="w3-padding-48">
          <a className="weatherwidget-io" href="https://forecast7.com/en/37d27n121d85/95136/" data-label_1="San Jose, CA" data-font="Verdana" data-icons="Climacons Animated" data-theme="pure" >SAN JOSE</a>
        </div>
      </div>
    </div>
  )
}
