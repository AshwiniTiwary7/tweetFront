import React, { useEffect, useState } from 'react';
import logo from '../images/logo.png';
import profilePic from '../images/ProfilePic.png';
import './Sidebar.css';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import sweetAlert from 'sweetalert2';
import axios from 'axios';

export default function Sidebar() {
    const navigate = useNavigate();
    const [sideDetails, setSideDetails] = useState({
        fullName: "",
        userName: "",
        userProfilePicture: ""
    })
    async function getUserDetails() {
        const token = localStorage.getItem('myToken');
        try {
            const respDetails = await axios.get('https://tweeterback-bqhr.onrender.com/api/vt1/details', {
                headers: { "Authorization": "Bearer " + token }
            })
            if (respDetails.data) {
                setSideDetails({
                    fullName: respDetails.data.userDetail.fullName,
                    userName: respDetails.data.userDetail.userName,
                    userProfilePicture: respDetails.data.userDetail.userProfilePicture
                })
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
    function logMeOut() {
        localStorage.clear();
        navigate("/login");
    }
    useEffect(() => {
        getUserDetails();
    }, []);
    return (
        <div className='sidebar-body sidebar'>
            <img src={logo} height={"70vh"} className='ms-3 logo' alt="Logo" />
            <div className='d-flex flex-column mt-3 ms-4 menu'>
                <NavLink className='menu-item fw-bold p-2 ps-3' to='/home'>
                    <i className="fa-solid fa-house me-3 icons"></i>
                    Home
                </NavLink>
                <NavLink className='menu-item fw-bold p-2 ps-3' to={{ pathname: `/profile/${sideDetails.userName}` }}>
                    <i className="fa-solid fa-user me-3 icons"></i>
                    Profile
                </NavLink>
                <button className='menu-item fw-bold p-2 ps-3 border-0 text-start' onClick={logMeOut}>
                    <i className="fa-solid fa-right-from-bracket me-3 icons"></i>
                    Logout
                </button>
                <div className='position-absolute bottom-0 pb-4 d-flex flex-row profile-section'>
                    {
                        sideDetails.userProfilePicture ? (<img src={sideDetails.userProfilePicture} height={"90vh"} className='profile-profilepic' alt="Profile" />) : (<img src={profilePic} height={"90vh"} className='profile-profilepic' alt="Profile" />)
                    }
                    <div className='d-flex flex-column ms-3'>
                        <p className='fw-bold'>{sideDetails.fullName}</p>
                        <p className='username'>@{sideDetails.userName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
