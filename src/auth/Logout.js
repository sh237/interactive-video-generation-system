import React, { useState,useEffect } from "react";
import './Auth.css';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../FirebaseConfig.js";
import { Navigate } from "react-router-dom";
import {
    signOut,
  } from "firebase/auth";
  
const Logout = () => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [user, setUser] = useState();
    const [logout, setLogout] = useState(false);


    useEffect(() => {
        //ログアウトの処理を行う
        signOut(auth)
        .then(() => {
          console.log("Sign-out successful.");
          setLogout(true);
        })
        .catch((err) => {
          console.log(err.message);
        });
    });

    return (
        <div className="auth-container">
            {logout ? (
                <Navigate to={`/login/`} />
            ) : (
                <h1>ログアウト中</h1>
            )}
        </div>
    );
    };

export default Logout;