import React, { useEffect, useState } from 'react';
import './Tweet.css';
import profilePic from '../images/ProfilePic.png';
import sweetAlert from 'sweetalert2';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Tweet(props) {
    const allTweets = props.allTweets;
    const getAllFeeds = props.getAllFeeds;
    let userId = localStorage.getItem('userNo');
    const [likedTweetss, setLikedTweets] = useState([]);
    async function deleteTweetUser(tweetId) {
        const token = localStorage.getItem('myToken');
        try {
            const respDeletedTweet = await axios.delete(`https://tweeterback-bqhr.onrender.com/api/vt1/d/${tweetId}`, {
                headers: { "Authorization": "Bearer " + token }
            });
            if (respDeletedTweet.data) {
                sweetAlert.fire({
                    title: respDeletedTweet.data.message,
                    icon: "success"
                })
            }
            getAllFeeds();
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
    async function likeTweets(tweetId) {
        const token = localStorage.getItem('myToken');
        try {
            await axios.get(`https://tweeterback-bqhr.onrender.com/api/vt1/like/${tweetId}`, {
                headers: { "Authorization": "Bearer " + token }
            });
            getAllFeeds();
            getLikedTweet();
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
    async function getLikedTweet() {
        const token = localStorage.getItem('myToken');
        try {
            const respLikedTweets = await axios.get('https://tweeterback-bqhr.onrender.com/api/vt1/details', {
                headers: { "Authorization": "Bearer " + token }
            })
            if (respLikedTweets.data) {
                setLikedTweets(respLikedTweets.data.userDetail.likedTweets);
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
    async function addRetweet(tweetId) {
        const token = localStorage.getItem("myToken");
        try {
            await axios.get(`https://tweeterback-bqhr.onrender.com/api/vt1/rt/${tweetId}`, {
                headers: { "Authorization": "Bearer " + token }
            });
            getAllFeeds();
            getLikedTweet();
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
        userId = localStorage.getItem('userNo');
        getLikedTweet();
    }, []);
    if (allTweets.length === 0) {
        return (<h4 className='p-2 mx-5 w-50 border'>No tweets yet!</h4>)
    }
    else {
        return (
            allTweets.map((singleTweet) => {
                return (
                    <div className='card tweet-body' key={singleTweet._id}>
                        <div className='card-body'>
                            <div className='tweet-header row float-end'>
                                {/* <div className='col-7 col-md-9 col-lg-7 card-subtitle text-body-secondary'>
                                    <p className='retweet-statement'>
                                        <i className="fa-solid fa-retweet me-1" style={{ color: "#a1a1a1" }}></i>
                                        retweeted by @anotherUser
                                    </p>
                                </div> */}
                                {
                                    userId === singleTweet.tweetBy._id ? (<button className='col-1 delete-btn-design' onClick={() => { deleteTweetUser(singleTweet._id) }}>
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button>) : ("")
                                }
                            </div>
                            <div className='tweet-content row'>
                                <div className='col-2 text-center'>
                                    {
                                        singleTweet.tweetBy.userProfilePicture ? (<img src={singleTweet.tweetBy.userProfilePicture} height={"90vh"} className='profile-profilepic' alt="Profile" />) : (<img src={profilePic} height={"90vh"} className='profile-profilepic' alt="Profile" />)
                                    }
                                </div>
                                <div className='col-10'>
                                    <div className='tweet-user-info row'>
                                        <div className='col-md-12 col-lg-12'>
                                            <Link to={{ pathname: `/profile/${singleTweet.tweetBy.userName}` }} className='tweet-username'>@{singleTweet.tweetBy.userName}</Link>
                                        </div>
                                        <div className='col-md-12 col-lg-12'>
                                            <p className='text-body-secondary date-section'>{singleTweet.tweetTime.split("T")[0]}</p>
                                        </div>
                                    </div>
                                    <p className='caption'>
                                        {singleTweet.tweetBody}
                                    </p>
                                    {
                                        singleTweet.tweetImage ? (<img src={singleTweet.tweetImage} className='tweet-image' alt="Tweet" />) : ("")
                                    }
                                    {/* action buttons */}
                                    <div className='tweet-actions row mt-2'>

                                        {/* like button */}
                                        <div className='col-2 col-md-3 action-btn'>
                                            <button className='like-button' onClick={() => { likeTweets(singleTweet._id) }}>{likedTweetss.includes(singleTweet._id) ? (<i class="fa-solid fa-heart" style={{ color: "#f24040" }}></i>) : (<i class="fa-regular fa-heart"></i>)}</button>{singleTweet.tweetLikes.length}
                                        </div>

                                        {/* reply button */}
                                        <div className='col-2 col-md-3 action-btn'>
                                            <Link to={{ pathname: `/tweetDetail/${singleTweet._id}` }}><i className="fa-regular fa-comment me-2" role='button' style={{ color: "#478bff" }}></i>{singleTweet.tweetComments.length}</Link>
                                        </div>
                                        {/* retweet button */}
                                        <div className='col-2 col-md-3 action-btn'>
                                            <button className='retweet-button' onClick={() => { addRetweet(singleTweet._id) }}><i className="fa-solid fa-retweet me-1" style={{ color: "blue" }}></i></button>{singleTweet.tweetRe.length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        )
    }

}
