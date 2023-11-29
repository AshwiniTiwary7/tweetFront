import React, { useEffect, useState } from 'react';
import './Profile.css';
import profilePic from '../images/ProfilePic.png';
import Tweet from './Tweet';
import sweetAlert from 'sweetalert2';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function Profile() {
    const location = useLocation();
    const userName = location.pathname.split("/")[2];
    let myID = localStorage.getItem('userNo');
    const [profiePic,setProfilePic] = useState("");
    const [userDetail,setUserDetail] = useState({
        userId:"",
        fullName:"",
        userName:"",
        DOB:"",
        userLocation:"",
        userProfilePicture:"",
        userFollowers:[],
        userFollowing:[]
    });
    const [allTweets,setAllTweets] = useState([]);
    const [editProfile,setEditProfile] = useState({
        fullName:"",
        DOB:"",
        userLocation:""
    })
    function monitorEditUser(event){
        setEditProfile((prev)=>({
            ...prev,[event.target.id]:event.target.value
        }))
    }
    async function getUserDetails(){
        const token = localStorage.getItem('myToken');
        try {
            const respDetails = await axios.get(`https://tweeterback-bqhr.onrender.com/api/vt1/p/${userName}`,{
                headers:{"Authorization" : "Bearer " + token}
            })
            if(respDetails.data){
                setUserDetail({
                    userId:respDetails.data.userDetail._id,
                    fullName:respDetails.data.userDetail.fullName,
                    userName:respDetails.data.userDetail.userName,
                    DOB:respDetails.data.userDetail.DOB,
                    userLocation:respDetails.data.userDetail.userLocation,
                    userProfilePicture:respDetails.data.userDetail.userProfilePicture,
                    userFollowers:respDetails.data.userDetail.userFollower,
                    userFollowing:respDetails.data.userDetail.userFollowing
                });
                setAllTweets(respDetails.data.userDetail.userTweets);
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

    async function editUserDetail(event){
        event.preventDefault();
        const token = localStorage.getItem('myToken');
        try {
            const respEditedUser = await axios.post('https://tweeterback-bqhr.onrender.com/api/vt1/e',editProfile,{
                headers:{"Authorization" : "Bearer " + token}
            });
            if(respEditedUser.data){
                sweetAlert.fire({
                    title:respEditedUser.data.message,
                    icon:"success"
                })
            }
            getUserDetails();
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
    async function followTheUser(userName){
        const token = localStorage.getItem('myToken');
        try {
            const respFollow = await axios.get(`https://tweeterback-bqhr.onrender.com/api/vt1/follow/${userName}`,{
                headers:{"Authorization" : "Bearer " + token}
            });
            if(respFollow.data){
                sweetAlert.fire({
                    title:respFollow.data.message,
                    icon:"success"
                })
            }
            getUserDetails();
        }  catch (err) {
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
    async function profilePhoto(){
        const token = localStorage.getItem("myToken");
        try {
            let formData = new FormData();
            formData.append("userProfilePicture", profiePic);
            const respProfilePhoto = await axios.post('https://tweeterback-bqhr.onrender.com/api/vt1/pic',formData,{
                headers:{"Authorization" : "Bearer " + token}
            });
            if(respProfilePhoto.data){
                sweetAlert.fire({
                    title:respProfilePhoto.data.message,
                    icon:"success"
                })
            }
            getUserDetails();
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
    function getMyNo(){
       myID = localStorage.getItem('userNo');
    }
    useEffect(()=>{
        getUserDetails();
        getMyNo();
    },[userName]);
    return (
        <div className='profile-body border overflow-auto overflow-x-hidden'>
            <h5 className='m-3'>Profile</h5>
            <div className='blue-div mx-3'></div>
            <div className='row profile-pic-row'>
                <div className='col'>
                    {
                        userDetail.userProfilePicture ? (<img src={userDetail.userProfilePicture} height={"90vh"} className='profile ms-5' alt="Profile" />) : (<img src={profilePic} height={"90vh"} className='profile ms-5' alt="Profile" />)
                    }
                    <div className='mt-3 ms-4'>
                        <h5>{userDetail.fullName}</h5>
                        <p className='text-body-secondary'>@{userDetail.userName}</p>
                    </div>
                </div>
                <div className='col'>
                    <div className='d-flex flex-row float-end me-3 mt-5'>
                        <div>
                            {
                                myID === userDetail.userId ? (<button type="button" className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal2">Upload Profile Photo</button>) : (<button type="button" className={userDetail.userFollowers.includes(myID) ? "btn btn-outline-secondary" : "btn btn-outline-primary"} onClick={()=>{followTheUser(userName)}}>{userDetail.userFollowers.includes(myID) ? ("Unfollow") : ("Follow")}</button>)
                            }
                            {/* Upload Profile Photo Modal */}
                            <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel2">Upload Profile Photo</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="alert alert-primary fw-bold" role="alert">
                                                Note: The image should be square in shape.
                                            </div>
                                            <div className="mb-3">
                                                <input className="form-control" type="file" id="formFile" onChange={(e)=>{setProfilePic(e.target.files[0])}} />
                                            </div>
                                            <div className='text-center'>
                                                <img src={profilePic} height={"250vh"} className='mt-3' alt="Preview" />
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={profilePhoto}>Save Profile Picture</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            {
                                myID === userDetail.userId ? (<button type="button" className="btn btn-outline-secondary ms-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop11">Edit Profile</button>) : ("")
                            }
                            {/* Edit Profile Modal */}
                            <div className="modal fade" id="staticBackdrop11" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="staticBackdropLabel">Edit Profile</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form>
                                                <div className="mb-3">
                                                    <label htmlFor="formGroupExampleInput" className="form-label">Name</label>
                                                    <input type="text" className="form-control" id="fullName" placeholder="Enter your fullname" value={editProfile.fullName} onChange={monitorEditUser}/>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="formGroupExampleInput2" className="form-label">Location</label>
                                                    <input type="text" className="form-control" id="userLocation" placeholder="Enter location" value={editProfile.userLocation} onChange={monitorEditUser}/>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="formGroupExampleInput3" className="form-label">Date of Birth</label>
                                                    <input type="date" className="form-control" id="DOB" placeholder="Enter date of birth" value={editProfile.DOB} onChange={monitorEditUser}/>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={editUserDetail}>Save Changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row ms-2 details-row'>
                <div className='col-4 col-md-12 col-lg-4 d-flex flex-row dob-section'>
                    <i className="fa-solid fa-calendar-day mt-1 me-2"></i>
                    <p>DOB :&nbsp; </p>
                    <p className='text-body-secondary'>{userDetail.DOB === undefined ? (userDetail.DOB) : (userDetail.DOB.split("T")[0])}</p>
                </div>
                <div className='col-6 col-md-12 col-lg-5 d-flex flex-row'>
                    <i className="fa-solid fa-location-dot mt-1 me-2"></i>
                    <p>Location :&nbsp; </p>
                    <p className='text-body-secondary'>{userDetail.userLocation}</p>
                </div>
            </div>
            <div className='row ms-2'>
                <div className='col d-flex flex-row gap-3'>
                    <p className='fw-bold'>{userDetail.userFollowing.length} Following</p>
                    <p className='fw-bold'>{userDetail.userFollowers.length} Followers</p>
                </div>
            </div>
            <div className='row d-flex flex-column'>
                <h5 className='col text-center'>Tweets and replies</h5>
                <div className='ms-4'>
                    <Tweet allTweets={allTweets} getAllFeeds={getUserDetails} />
                </div>
            </div>
        </div>
    );
}
