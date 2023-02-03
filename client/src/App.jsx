import React from 'react';
import "./w3.css";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {Auth0Provider, useAuth0} from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";

import Home from "./components/Home";
import Details from "./components/Details";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import Create from "./components/Create";
//import Login from "./components/Login";
//import Register from "./components/Register";
import VerifyUser from "./components/VerifyUser";
import AuthDebugger from "./components/AuthDebugger";
import Search from "./components/Search";

import {Combiner} from "./Utils"

const requestedScopes = [
  "read:article",
  "read:user",
  "edit:article",
  "edit:user",
  "delete:article",
  "delete:user",
  "write:article",
  "write:user",
];

function RequireAuth({ children }) {
  const { isLoading, isAuthenticated } = useAuth0();

  if (!isLoading && !isAuthenticated) {
    alert("You must login before proceeding!")
    return (
      <Navigate to="/" replace />
    );
  }
  return children;
}

export default function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={`${window.location.origin}/verify-user`}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      scope={requestedScopes.join(" ")}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={Combiner(<Home/>)} />
            <Route path={"/home"} element={Combiner(<Home/>)} />
            <Route path={"/verify-user"} element={<VerifyUser/>} />
            <Route path={"/details/:id"} element={<RequireAuth>{Combiner(<Details/>)}</RequireAuth>} />
            <Route path={"/profile"} element={<RequireAuth>{Combiner(<Profile/>)}</RequireAuth>} />
            <Route path={"/create"} element={<RequireAuth>{Combiner(<Create/>)}</RequireAuth>} />
            <Route path={"/search"} element={<RequireAuth>{Combiner(<Search/>)}</RequireAuth>} />
            <Route path={"/debugger"} element={<RequireAuth><AuthDebugger /></RequireAuth>} />
            <Route path={"*"} element={Combiner(<NotFound/>)} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  );
}
