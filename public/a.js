import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ChatIndex from "./ChatIndex.js";
import { Video } from "./Video.js";
import { Player, ControlBar, PlaybackRateMenuButton } from "video-react";
import "../node_modules/video-react/dist/video-react.css"; // import css
import Split from '@uiw/react-split';
import { Configuration, OpenAIApi } from "openai";
import { Ask } from "./Ask.js";

function App() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState('');
  const [text, setText] = useState('');
  const [is_first, setIsFirst] = useState(true);
  const videoRef = useRef(null);
  const [width, setWidth] = useState("50%");

  const handleDrag = (e) => {
    setWidth(e.clientX + "px");
  };

  const chat = (event) => {
    setText(event.target.value);
  }

  const userName = (event) => {
    setUser(event.target.value);
  }

  const handlePlay = () => {
    videoRef?.current?.play();
  };

  const handlePause = () => {
    videoRef.current.pause();
  };


  return (
    <React.Fragment>
          <Split
        direction={'horizontal'}
        style={{height: "100vh"}}
        >
        <div className="scrollable">
          {/* 左側のスクロール可能なコンテンツ */}
          <div className="chat-main">
            <ChatIndex items={items} />
          </div>
          <div className="sub-container">
            <form onSubmit={handleSubmit}
                      autoComplete="off">
            <textarea
                    onChange={userName}
                    value={user}
                    id='name'
                    placeholder="名前"
                  /><br/>
            <textarea
                    id="chat"
                    onChange={chat}
                    value={text}
                    placeholder="チャット"
                  /><br/>
            <button
                    className="btn btn-success"
                    type="submit"
                  >送信
            </button>
            </form>
          </div>
        </div>
      <div className="bg" style={{flex:1, height:"100%"}}>
        {/* 右側のコンテンツ */}
            <video controls={false} ref={videoRef}  autoPlay loop>
            <source src="https://d-id-talks-prod.s3.us-west-2.amazonaws.com/auth0%7C64098f63cd43ff0273dad426/tlk_ChB1C-h9lciY1AKx3QQfe/SugiuraKomei_200x240.mp4?AWSAccessKeyId=AKIA5CUMPJBIK65W6FGA&Expires=1678444269&Signature=u4IdC0aDm4tbp%2BlTN9atT4RntEY%3D" type="video/mp4" />
            </video>
            <button onClick={handlePlay}>再生</button>
            <button onClick={handlePause}>停止</button>
      </div>
      </Split>

    
    </React.Fragment>
  );
}

export default App;
