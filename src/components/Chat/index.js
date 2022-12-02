import React, { useState, useEffect } from 'react';
import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import { useSelector } from "react-redux";
import useChat from '../../hook/useChat';

const Chat = (props) => {
    const { isMinimize } = useSelector(state => state.dashboard)
    const pageHead = 'Chat'

    // const { roomId } = props.match.params;
    const { messages, sendMessage } = useChat(1);
    const [newMessage, setNewMessage] = useState("");
    useEffect(() => {
        console.log(messages);
    },[messages])
    const handleNewMessageChange = (event) => {
      setNewMessage(event.target.value);
    };
  
    const handleSendMessage = () => {
      sendMessage(newMessage);
      setNewMessage("");
    };
    return (
        <>
            <div id="layout-wrapper">
                <Header pageHead={pageHead} />
                <Sidebar />
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                    <div className="page-content chat-page-sec">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12 chat-new">
                                    <div className="chat-box-left">
                                        <div className="chat-search">
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <input type="text" id="chat-search" name="chat-search" className="form-control" placeholder="Search by Driver Name" />
                                                    <span className="input-group-append">
                                                        <button type="button" className="btn btn-gradient-primary shadow-none"><i className="ri-search-line"></i></button>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-content chat-list slimscroll" id="pills-tabContent">
                                            <div className="tab-panes" id="general_chat">
                                                <a href="/" className="media">
                                                    <div className="media-left">
                                                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                        <span className="round-10 bg-danger"></span>
                                                    </div>
                                                    <div className="media-body">
                                                        <div>
                                                            <h6>Dennis Wilson</h6>
                                                            <p>Good morning! How are you?</p>
                                                        </div>
                                                        <div>
                                                            <span>26 Jan</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="chat-box-right">
                                        <div className="chat-header">
                                            <a href="/" className="media">
                                                {/* <div className="media-left">
                                                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                </div> */}
                                                <div className="media-body">
                                                    <div>
                                                        <h6 className="mb-1 mt-0">Mary Schneider</h6>
                                                        {/* <p className="mb-0">Last seen: 2 hours ago</p> */}
                                                    </div>
                                                </div>
                                            </a>
                                            <div className="chat-features">
                                                <div className="d-none d-sm-inline-block">
                                                    {/* <a href="/"><i className="fas fa-phone"></i></a>
                                                    <a href="/"><i className="fas fa-video"></i></a>
                                                    <a href="/"><i className="fas fa-trash-alt"></i></a>
                                                    <a href="/"><i className="fas fa-ellipsis-v"></i></a> */}
                                                    <button className="urgent-notification">Send Urgent Notification <i className="ri-alarm-warning-line"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="chat-body ">
                                            <div className="chat-detail slimscroll">
                                                <div className="media">
                                                    <div className="media-body">
                                                        <ul className="chat-design-photos">
                                                            <li className="person-photo">
                                                            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                            </li>
                                                            <li className="name-and-chat">
                                                                <p className="name-time">Daniel Madsen <span>Friday 2:20 PM</span></p>
                                                                <div className="chat-msg">
                                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                {messages.map((message, i) => (
                                                    <div className="media" key={i}>
                                                     <div className={`message-item ${
                                                                message.ownedByCurrentUser ? "media-body reverse" : "media-body"
                                                            }`}>
                                                         <ul className="chat-design-photos">
                                                            {!message.ownedByCurrentUser ? 
                                                             <li className="person-photo">
                                                                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                             </li>
                                                             : ''}
                                                             <li className="name-and-chat">
                                                                 <p className="name-time">{message.ownedByCurrentUser ? 'You':  'Daniel Madsen'} <span>Friday 2:20 PM</span></p>
                                                                 <div className="chat-msg">
                                                                     <p> {message.body}</p>
                                                                 </div>
                                                             </li>
                                                         </ul>
                                                     </div>
                                                 </div>
                                                ))}
                                               
                                                <div className="media">
                                                    <div className="media-body reverse">
                                                        <ul className="chat-design-photos">
                                                            <li className="name-and-chat">
                                                                <p className="name-time">You <span>Friday 2:20 PM</span></p>
                                                                <div className="chat-msg">
                                                                    <p>Good Morning !</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="chat-footer">
                                            <div className="row">
                                                <div className="col-12 col-md-12">
                                                    <input type="text" value={newMessage} onChange={handleNewMessageChange} className="form-control" placeholder="Type something here..." />
                                                    <div className="d-none d-sm-inline-block chat-features">
                                                        <button type='button' onClick={handleSendMessage} className="msg-sand-btnn"><i className="ri-send-plane-fill"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Chat;