import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import ChatIndex from "./ChatIndex.js";
// import "../node_modules/video-react/dist/video-react.css"; // import css
import Split from 'react-split'
import { Configuration, OpenAIApi } from "openai";
import { Ask } from "./Ask.js";
import { BsFillCloudDownloadFill } from "react-icons/bs";
import {CustomButton} from "./CustomButton.js";
import { FiPlayCircle } from "react-icons/fi";
import { FiPauseCircle } from "react-icons/fi";
import {MdOutlineReplay5} from "react-icons/md";
import {MdOutlineForward5} from "react-icons/md";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { onAuthStateChanged,signOut } from "firebase/auth";
import { auth } from "../FirebaseConfig.js";
import Header from './Header'
import { useNavigate } from "react-router-dom";
import ReactLoading  from "react-loading";
import { Navigate } from "react-router-dom";

function Home() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [processLoading, setProcessLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [user, setUser] = useState('');
  const [text, setText] = useState('');
  const [is_first, setIsFirst] = useState(true);
  const videoRef = useRef(null);
  const [mode, setMode] = useState(1);
  const [width, setWidth] = useState("50%");
  const [videoUrl, setVideoUrl] = useState("");
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [settingModalIsOpen, setSettingModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login/");
  }

  /* ↓ログインしているかどうかを判定する */
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitialLoading(false);
    });
  }, []);

  function Spinner() {
    return (
      <div className="sk-plane sk-center"></div>
    )
  }
  
  const handleDrag = (e) => {
    setWidth(e.clientX + "px");
  };

  const chat = (event) => {
    setText(event.target.value);
  }

  const handlePlay = () => {
    videoRef?.current?.play();
  };

  const handlePause = () => {
    videoRef?.current?.pause();
  };

  const handleRewindVideo = (time) => {
    videoRef.current.currentTime -= time;
  };
  const handleForwardVideo = (time) => {
    videoRef.current.currentTime += time;
  };

  const handleModeChange = (event) => {
      setMode(event.target.value);
      console.log(event.target.value);
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    if(text === "") {
      alert('何か入力してください')
      return;
    }
    setProcessLoading(true);

    const newItem = {
      user: user,
      text: text,
    };
    setItems(items.concat(newItem));
    let res;
    if(is_first) {
      console.log("text"+text);
      res = await Ask(text, true, mode);
      setIsFirst(false);
    } else {
      res = await Ask(text, false, mode);
    }
    console.log("res"+res);

    res = res?.replace(/\([^()]*\)/g, '');


    let id;
    let source_url_ = "https://lib-arts.hc.keio.ac.jp/education/information/images/uploads/2021/12/SugiuraKomei_200x240.jpg";
    let speaker = "Keita";
    if(mode === 3) {
      source_url_ = "https://contents.oricon.co.jp/cdn-cgi/image/width=1200,quality=85,format=auto/upimg/news/2271000/2270896/20230309_124021_p_o_35647265.jpg";
      speaker = "Nanami";
    }


    let options = {
      method: 'POST',
      headers: {accept: 'application/json', 'content-type': 'application/json', authorization: process.env.REACT_APP_DID_API_KEY},
      body: JSON.stringify({
        script: {
          type: 'text',
          provider: {type: 'microsoft', voice_id: speaker},
          ssml: 'false',
          input: res
        },
        config: {fluent: 'false', pad_audio: '0.0'},
        source_url: source_url_,
      })
    };
    
    await fetch('https://api.d-id.com/talks', options)
    .then(response => response.json())
    .then(response => {
      console.log(response); 
      id = response.id;
    })
    .catch(err => console.error(err));
    
    new Promise(resolve => setTimeout(resolve, 1 * 1000));

    if(id !== undefined || id !== null) {
      let options = {
        method: 'GET',
        headers: {accept: 'application/json', authorization: process.env.REACT_APP_DID_API_KEY}
      };
      //response.result_urlを取得するまでアクセスする。
      let count = 0;
      let flag = false;
      while (count < 50 && !flag) {
        count++;
        await fetch(`https://api.d-id.com/talks/${id}`, options)
          .then(response => response.json())
          .then(response => {
            console.log(response);
            console.log("result_url" + response.result_url);
            if (response.result_url) {
              setVideoUrl(response.result_url);
              flag = true;
            }
          })
          .catch(err => console.error(err));

        if (!flag) {
          await new Promise(resolve => setTimeout(resolve, 2 * 1000));
          console.log("count" + count);
        }
      }
      handlePlay();
      console.log("end");
  }
  setProcessLoading(false);
}
  const scrollableRef = useRef(null);
  useEffect(() => {
    // コンポーネントが更新されたときに最下部にスクロールする
    const node = scrollableRef.current;
    node.scrollTop = node.scrollHeight;
  });
  useEffect(() => {
    videoRef.current.load();
    console.log("videoUrl " + videoUrl);
    console.log("videoUrl Effect");
    handlePlay();
  }, [videoUrl])

  useEffect(() => {
    console.log("mode Effect "+processLoading);
    // if(processLoading){

    // }
    // else{

    // }
  },[processLoading]);


  return (
    <React.Fragment>
      {/* {!user ? (
        <Navigate to={`/login/`} />
      ) : (
        <> */}
      <div className="App">
        {processLoading &&        
         <div style={{position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ReactLoading
          type="spin"
          color="black"
          height="50px"
          width="50px"
          className="mx-auto"
        />
        </div>}
        <Header user={user}/>
          <Split 
          className="split"
          sizes={[60, 40]}
          minSize={10}
          style={{ height: '100vh' }}
          >

        <div className="scrollable" ref={scrollableRef}>
          {/* 左側のスクロール可能なコンテンツ */}
          <div className="chat-main">
            <ChatIndex items={items} /> 
          </div>
          <div className="sub-container">
            <form onSubmit={handleSubmit}
                      autoComplete="off">
                <textarea
                        id="chat"
                        onChange={chat}
                        value={text}
                        placeholder="チャット"
                    /><br/>
                <button
                        className="button btn-success"
                        type="submit"
                    >送信
                </button>
                <FormControl variant="filled"  className={classes.formControl}>
                {/* <FormControl variant="filled"  sx={{ m: 1, minWidth: 80 }}> */}
                <InputLabel id="input-label" style={{color: 'black'}}>モード</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={mode}
                onChange={handleModeChange}
                // autoWidth
                label="Age"
                >
                <MenuItem value={1}>普通</MenuItem>
                <MenuItem value={2}>格好いい</MenuItem>
                <MenuItem value={3}>可愛い</MenuItem>
                </Select>
            </FormControl>
            </form>
          </div>
      </div>
      <div className="bg" style={{ flexDirection:'column',flex: "1", display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
        {/* 右側のコンテンツ */}
            <video controls={false} ref={videoRef}  autoPlay loop>
              <source src={videoUrl} type="video/mp4" />
            </video>
          <div style={{  justifyContent: 'center', alignItems: 'center', width:'50%',paddingTop:'4%' }}>
            <button onClick={()=>handleRewindVideo(5)}>
              <MdOutlineReplay5 size={30} color={'#333'} style={{justifySelf:'center',alignSelf:'center'}}/>
            </button>
            <button onClick={()=>handleForwardVideo(5)}>
              <MdOutlineForward5 size={30} color={'#333'} style={{justifySelf:'center',alignSelf:'center'}}/>
            </button>
            <button onClick={handlePlay}>
              <FiPlayCircle size={30} color={'#333'} style={{justifySelf:'center',alignSelf:'center'}}/>
            </button>
            <button onClick={handlePause}>
              <FiPauseCircle size={30} color={'#333'} style={{justifySelf:'center',alignSelf:'center'}}/>
            </button>
            <a style={{textDecoration:'none',justifyContent: 'center', alignItems: 'center'}} href={videoUrl}>
              <CustomButton as="">
                  <BsFillCloudDownloadFill size={30} color={'#333'} style={{justifySelf:'center',alignSelf:'center'}}/>
              </CustomButton>
            </a>
          </div>
      </div>
      </Split>
      </div>
    </React.Fragment>
  );
}
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    '& .MuiInputBase-root': { // プルダウンメニューを囲む要素に対してのスタイル
      backgroundColor: '#DEE3EA', // 背景色を灰色に変更
      borderRadius: '8px', // 角を丸くする
      borderBottom: 'none',
      borderBottomColor: '#0a0',
    },
    '& .MuiInput-underline:before': { // 下線に対するスタイル
      borderBottom: 'none',
      borderBottomColor: '#0a0',
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { // ホバー時の下線に対するスタイル
      // borderBottom: '2px solid #0a0',
      borderBottom: 'none',
      borderBottomColor: '#0a0',
    },
    '& .MuiInput-underline:after': { // 選択時の下線に対するスタイル
      borderBottom: 'none',
      borderBottomColor: '#0a0',
    },
    '& .MuiSelect-select:focus': { // フォーカス時のスタイル
      backgroundColor: '#f5f5f5', // 背景色をより明るくする
      borderBottom: 'none',
      borderBottomColor: '#0a0',
    },
    '& .MuiList-root': { // プルダウンメニューに対するスタイル
      backgroundColor: '#DEE3EA', // 背景色を灰色に変更
      borderRadius: '8px', // 角を丸くする
      borderBottom: 'none',
      borderBottomColor: '#0a0',

    },
  },
}));
export default Home;
