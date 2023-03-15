import React, { useState,useEffect } from "react";
import './Auth.css';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../FirebaseConfig.js";
import { Navigate } from "react-router-dom";

const Login = () => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [user, setUser] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(
            auth,
            loginEmail,
            loginPassword
            );
        } catch(error) {
            alert("メールアドレスまたはパスワードが間違っています");
        }
    };


    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        });
    });

    return (
        <div className="auth-container">
            {user ? (
        <Navigate to={'/'} />
      ) : (
        <>
        <h1>ログインページ</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
            <div>
            <label>メールアドレス</label>
            <input
                name="email"
                type="email"
                className="form-control"
                onChange={(e) => setLoginEmail(e.target.value)}
            />
            </div>
            <div>
            <label>パスワード</label>
            <input
                name="password"
                type="password"
                className="form-control"
                onChange={(e) => setLoginPassword(e.target.value)}
            />
            </div>
            <button className="auth-button">ログイン</button>
        </form>
        </>
        )}   
        </div>
    );
    };

export default Login;