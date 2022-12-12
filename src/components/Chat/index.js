import React from "react";
import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import { useSelector } from "react-redux";

const Chat = () => {

    const { isMinimize } = useSelector(state => state.dashboard)
    const { user } = useSelector((state) => state.auth);

    const pageHead = 'Chat';
    var userType = user && user.user && user.user.userType;

    return (
        <>
            <div id="layout-wrapper">
                <Header pageHead={pageHead} />
                <Sidebar />
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                    <div className={userType === "company-administrator" ? "page-content chat-page-sec company-admin" : "page-content chat-page-sec"}>
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
                                                <a href="/" className="media new-message">
                                                    <div className="media-left">
                                                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                        <span className="round-10 bg-success"></span>
                                                    </div>
                                                    <div className="media-body">
                                                        <div className="d-inline-block">
                                                            <h6>Daniel Madsen</h6>
                                                            <p>Good morning! Congratulations Friend...</p>
                                                        </div>
                                                        <div>
                                                            <span>20 Feb</span>
                                                            <span>3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="/" className="media new-message">
                                                    <div className="media-left">
                                                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                        <span className="round-10 bg-success"></span>
                                                    </div>
                                                    <div className="media-body">
                                                        <div>
                                                            <h6>Robert Jefferson</h6>
                                                            <p>Congratulations Friend...</p>
                                                        </div>
                                                        <div>
                                                            <span>20 Feb</span>
                                                            <span>1</span>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="/" className="media active">
                                                    <div className="media-left">
                                                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                        <span className="round-10 bg-danger"></span>
                                                    </div>
                                                    <div className="media-body">
                                                        <div>
                                                            <h6>Jesse Ross</h6>
                                                            <p>How are you Friend...</p>
                                                        </div>
                                                        <div>
                                                            <span>15 Feb</span>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="/" className="media">
                                                    <div className="media-left">
                                                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                        <span className="round-10 bg-danger"></span>
                                                    </div>
                                                    <div className="media-body">
                                                        <div>
                                                            <h6>Mary Schneider</h6>
                                                            <p>Have A Nice day...</p>
                                                        </div>
                                                        <div>
                                                            <span>14 Feb</span>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="/" className="media">
                                                    <div className="media-left">
                                                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                        <span className="round-10 bg-success"></span>
                                                    </div>
                                                    <div className="media-body">
                                                        <div>
                                                            <h6>David Herrmann</h6>
                                                            <p>Good morning! How are you?</p>
                                                        </div>
                                                        <div>
                                                            <span>10 Feb</span>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="/" className="media">
                                                    <div className="media-left">
                                                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                        <span className="round-10 bg-danger"></span>
                                                    </div>
                                                    <div className="media-body">
                                                        <div>
                                                            <h6>Mary Hayes</h6>
                                                            <p>How are you Friend...</p>
                                                        </div>
                                                        <div>
                                                            <span>1 Feb</span>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href="/" className="media">
                                                    <div className="media-left">
                                                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                        <span className="round-10 bg-danger"></span>
                                                    </div>
                                                    <div className="media-body">
                                                        <div>
                                                            <h6>Rita Duarte</h6>
                                                            <p>Have A Nice day...</p>
                                                        </div>
                                                        <div>
                                                            <span>30 Jan</span>
                                                        </div>
                                                    </div>
                                                </a>
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

                                                <div className="media">
                                                    <div className="media-body reverse">
                                                        <ul className="chat-design-photos">
                                                            <li className="name-and-chat">
                                                                <p className="name-time">You <span>Friday 2:20 PM</span></p>
                                                                <div className="chat-msg">
                                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="media">
                                                    <div className="media-body">
                                                        <ul className="chat-design-photos">
                                                            <li className="person-photo">
                                                            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                            </li>
                                                            <li className="name-and-chat">
                                                                <p className="name-time">Daniel Madsen <span>Friday 2:20 PM</span></p>
                                                                <div className="chat-msg">
                                                                    <p>Good Morning !</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

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

                                                <div className="media">
                                                    <div className="media-body reverse">
                                                        <ul className="chat-design-photos">
                                                            <li className="name-and-chat">
                                                                <p className="name-time">You <span>Friday 2:20 PM</span></p>
                                                                <div className="chat-msg">
                                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="media">
                                                    <div className="media-body">
                                                        <ul className="chat-design-photos">
                                                            <li className="person-photo">
                                                            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                            </li>
                                                            <li className="name-and-chat">
                                                                <p className="name-time">Daniel Madsen <span>Friday 2:20 PM</span></p>
                                                                <div className="chat-msg">
                                                                    <p>Good Morning !</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

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

                                                <div className="media">
                                                    <div className="media-body reverse">
                                                        <ul className="chat-design-photos">
                                                            <li className="name-and-chat">
                                                                <p className="name-time">You <span>Friday 2:20 PM</span></p>
                                                                <div className="chat-msg">
                                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="media">
                                                    <div className="media-body">
                                                        <ul className="chat-design-photos">
                                                            <li className="person-photo">
                                                            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user" className="rounded-circle thumb-md" />
                                                            </li>
                                                            <li className="name-and-chat">
                                                                <p className="name-time">Daniel Madsen <span>Friday 2:20 PM</span></p>
                                                                <div className="chat-msg">
                                                                    <p>Good Morning !</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

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
                                                    <input type="text" className="form-control" placeholder="Type something here..." />
                                                    <div className="d-none d-sm-inline-block chat-features">
                                                        <button className="msg-sand-btnn"><i className="ri-send-plane-fill"></i></button>
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