import React, { useState, useEffect } from "react";
import './Auth.css';
import { auth } from "../FirebaseConfig.js";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged
  } from "firebase/auth";
import { Navigate } from "react-router-dom";

const Register = () => {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [user, setUser] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createUserWithEmailAndPassword(
            auth,
            registerEmail,
            registerPassword
            );
        } catch(error) {
            alert("正しく入力してください");
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, []);
    

    return (
        <>
        {/* ↓ログインしていればマイページを表示 */}
      {/* { user ? (
        <Navigate to={`/`} />
      ) :( */}
        <div className="auth-container">
        <h1>新規登録</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
            <div>
            <label>メールアドレス</label>
            <input
                name="email"
                type="email"
                className="form-control"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
            />
            </div>
            <div>
            <label>パスワード</label>
            <input
                name="password"
                type="password"
                className="form-control"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
            />
            </div>
            <button className="auth-button">登録する</button>
        </form>
        </div>
      {/* )} */}
      </>
    );
};

export default Register;