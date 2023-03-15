import React from 'react';
import '../App.css';

export default function ChatIndex(props){
    return (
      <React.Fragment>
        <div className="chat-index">
          <ul>
            {props.items.map((item, i) => (
              <li key={i}>
              <div className="chat-bc">
                <div className="balloon6">
                  <div className="faceicon">
                  <img src={process.env.PUBLIC_URL + '/favicon.ico'} alt="アイコン" />
                  </div>
                  <div className="chating">
                    <div className="chats">
                      <p>{item.text}</p>
                    </div>
                  </div>
                </div>
              </div>
              </li>
            ))}
          </ul>
        </div>
      </React.Fragment>
    );
}
