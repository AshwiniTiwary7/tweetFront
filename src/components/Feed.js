import React, { useEffect, useState } from 'react';
import Tweet from './Tweet';
import './Feed.css';
import sweetAlert from 'sweetalert2';
import axios from 'axios';

export default function Feed() {
    const [allTweets,setAllTweets] = useState([]);
    const [tweetUser,setTweetUser] = useState({
        tweetBody:"",
        tweetImage:""
    })
    async function getAllFeeds(){
        const token = localStorage.getItem('myToken');
        try {
            const respAllFeeds = await axios.get('https://tweeterback-bqhr.onrender.com/api/vt1/allt',{
                headers:{"Authorization" : "Bearer " + token}
            });
            if(respAllFeeds.data){
                setAllTweets(respAllFeeds.data.tweetss);
            }
        } catch (err) {
            if(err.response.data){
                sweetAlert.fire({
                    title:err.response.data.message,
                    icon:"error"
                })
            }
            else{
                console.log(err);
            }
        }
    }
    function monitorTweet(event){
        const {type,id,value,files} = event.target;
        setTweetUser((prev)=>({
            ...prev,[id]: type === "file" ? files[0] : value
        }))
    }
    async function tweetAdd(){
        const token = localStorage.getItem("myToken");
        try {
            let formData = new FormData();
            formData.append("tweetBody",tweetUser.tweetBody);
            formData.append("tweetImage",tweetUser.tweetImage);
            const respTweetAdd = await axios.post('https://tweeterback-bqhr.onrender.com/api/vt1/t',formData,{
                headers:{"Content-Type": "multipart/form-data","Authorization" : "Bearer " + token}
            });
            if(respTweetAdd.data){
                sweetAlert.fire({
                    title:respTweetAdd.data.message,
                    icon:"success"
                })
            }
            getAllFeeds();
        } catch (err) {
            if(err.response.data){
                sweetAlert.fire({
                    title:err.response.data.message,
                    icon:"error"
                })
            }
            else{
                console.log(err);
            }
        }
    }
    useEffect(()=>{
        getAllFeeds();
    },[]);
    return (
        <div className='feed-body border overflow-auto overflow-x-hidden px-4 pt-3'>
            <div className='row'>
                <div className='col'>
                    <h5>Home</h5>
                </div>
                <div className='col pb-3'>
                    <button type="button" className="btn btn-primary px-5 float-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        Tweet
                    </button>
                    {/* tweet modal */}
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel69" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel69">New Tweet</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <textarea className="form-control" placeholder="Write your tweet" id="tweetBody" value={tweetUser.tweetBody} onChange={monitorTweet}></textarea>
                                    <input className="form-control my-3" name="file" type="file" id="tweetImage" onChange={monitorTweet}/>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={tweetAdd}>Tweet</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Tweet allTweets={allTweets} getAllFeeds={getAllFeeds}/>
        </div>
    );
}
