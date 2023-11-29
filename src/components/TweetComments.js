import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar';
import axios from 'axios';
import sweetAlert from 'sweetalert2';
import { Link, useLocation } from 'react-router-dom';
import profilePic from '../images/ProfilePic.png';

export default function TweetComments() {
    const location = useLocation();
    const tweetId = location.pathname.split("/")[2];
    const userId = localStorage.getItem("userNo");
    const [comment, setComment] = useState("");
    const [addDetails, setAddDetails] = useState({
        tweetId: "",
        userName: "",
        userProfilePicture: "",
        tweetTime: "",
        tweetBody: "",
        tweetImage: ""
    })
    const [tweetD, setTweetD] = useState([]);
    async function getTweetDetails() {
        const token = localStorage.getItem("myToken");
        try {
            const respTweetDetail = await axios.get(`https://tweeterback-bqhr.onrender.com/api/vt1/td/${tweetId}`, {
                headers: { "Authorization": "Bearer " + token }
            });
            if (respTweetDetail.data) {
                setAddDetails({
                    tweetId: respTweetDetail.data.tweetDetail._id,
                    userName: respTweetDetail.data.tweetDetail.tweetBy.userName,
                    userProfilePicture: respTweetDetail.data.tweetDetail.tweetBy.userProfilePicture,
                    tweetTime: respTweetDetail.data.tweetDetail.tweetTime,
                    tweetBody: respTweetDetail.data.tweetDetail.tweetBody,
                    tweetImage: respTweetDetail.data.tweetDetail.tweetImage
                })
                setTweetD(respTweetDetail.data.tweetDetail.tweetComments);
            }
        } catch (err) {
            if (err.response.data) {
                sweetAlert.fire({
                    title: err.response.data.message,
                    icon: "error"
                })
            }
            else {
                console.log(err);
            }
        }
    }
    async function userComment(tweetId) {
        const token = localStorage.getItem('myToken');
        try {
            const respComment = await axios.post(`https://tweeterback-bqhr.onrender.com/api/vt1/comment/${tweetId}`, { commentBody: comment }, {
                headers: { "Authorization": "Bearer " + token }
            });
            if (respComment.data) {
                sweetAlert.fire({
                    title: respComment.data.message,
                    icon: "success"
                })
            }
            getTweetDetails();

        } catch (err) {
            if (err.response.data) {
                sweetAlert.fire({
                    title: err.response.data.message,
                    icon: "error"
                })
            }
            else {
                console.log(err);
            }
        }
    }
    async function likeComments(commentId) {
        const token = localStorage.getItem('myToken');
        try {
            await axios.get(`https://tweeterback-bqhr.onrender.com/api/vt1/lc/${commentId}`, {
                headers: { "Authorization": "Bearer " + token }
            });
            getTweetDetails();
        } catch (err) {
            if (err.response.data) {
                sweetAlert.fire({
                    title: err.response.data.message,
                    icon: "error"
                })
            }
            else {
                console.log(err);
            }
        }
    }
    async function deleteReply(commentId) {
        const token = localStorage.getItem('myToken');
        try {
            const respDelReply = await axios.delete(`https://tweeterback-bqhr.onrender.com/api/vt1/dc/${addDetails.tweetId}/${commentId}`, {
                headers: { "Authorization": "Bearer " + token }
            });
            if (respDelReply.data) {
                sweetAlert.fire({
                    title: respDelReply.data.message,
                    icon: "success"
                })
            }
            getTweetDetails();
        } catch (err) {
            if (err.response.data) {
                sweetAlert.fire({
                    title: err.response.data.message,
                    icon: "error"
                })
            }
            else {
                console.log(err);
            }
        }
    }
    useEffect(() => {
        getTweetDetails();
    }, []);
    return (
        <>
            <div className='d-flex flex-row'>
                <Sidebar />
                <div className='feed-body border px-4 pt-3 overflow-auto overflow-x-hidden'>
                    <div className='card tweet-body'>
                        <div className='card-body'>
                            <div className='tweet-content row'>
                                <div className='col-2 text-center'>
                                    {
                                        addDetails.userProfilePicture ? (<img src={addDetails.userProfilePicture} className='profile-profilepic' alt="Profile" />) : (<img src={profilePic} className='profile-profilepic' alt="Profile" />)
                                    }
                                </div>
                                <div className='col-10'>
                                    <div className='tweet-user-info row'>
                                        <div className='col-md-12 col-lg-12'>
                                            <a className='tweet-username' href='/profile'>@{addDetails.userName}</a>
                                        </div>
                                        <div className='col-md-12 col-lg-12'>
                                            <p className='text-body-secondary date-section'>{addDetails.tweetTime}</p>
                                        </div>
                                    </div>
                                    <p className='caption'>
                                        {addDetails.tweetBody}
                                    </p>
                                    {
                                        addDetails.tweetImage ? (<img src={addDetails.tweetImage} className='tweet-image' alt="Tweet" />) : ("")
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary my-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        Reply
                    </button>
                    <div className="collapse" id="collapseExample" style={{ width: "40vw" }}>
                        <div className="card card-body mb-5">
                            <input class="form-control" type="text" placeholder="What you think about this post?" aria-label="readonly input example" value={comment} onChange={(e) => { setComment(e.target.value) }} />
                            <button className='btn btn-primary mt-4' onClick={() => { userComment(tweetId) }}>Reply</button>
                        </div>
                    </div>
                    {
                        tweetD.map((singleComment) => {
                            return (
                                <div className='py-3' key={singleComment._id}>
                                    <div className='card tweet-body'>
                                        <div className='card-body'>
                                            <div className='tweet-header row float-end'>
                                                <div className='col'>
                                                    <p className='d-flex flex-row float-end'>
                                                        <button className='like-button' onClick={() => { likeComments(singleComment._id) }}>
                                                            {singleComment.commentLikes.includes(userId) ? (<i className="fa-solid fa-heart me-1" style={{ color: "#ff0000" }}></i>) : (<i class="fa-regular fa-heart"></i>)}
                                                        </button>{singleComment.commentLikes.length}
                                                    </p>
                                                </div>
                                                <div className={userId === singleComment.commentBy._id ? "col" : "d-none"}>
                                                    <button className='col-1 delete-btn-design mb-3' onClick={() => { deleteReply(singleComment._id) }}>
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='tweet-content row'>
                                                <div className='col-2 text-center'>
                                                    {
                                                        singleComment.commentBy.userProfilePicture ? (<img src={singleComment.commentBy.userProfilePicture} height={"90vh"} className='profile-profilepic' alt="Profile" />) : (<img src={profilePic} height={"90vh"} className='profile-profilepic' alt="Profile" />)
                                                    }
                                                </div>
                                                <div className='col-10'>
                                                    <div className='tweet-user-info row'>
                                                        <div className='col-md-12 col-lg-12'>
                                                            <Link to={{ pathname: `/profile/${singleComment.commentBy.userName}` }} className='tweet-username'>Comment By: @{singleComment.commentBy.userName}</Link>
                                                        </div>
                                                    </div>
                                                    <p className='caption pt-2'>
                                                        {singleComment.commentBody}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </>
    )
}