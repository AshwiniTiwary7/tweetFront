import React, { useState } from 'react';
import './Login.css';
import logo from '../images/logo.png';
import axios from 'axios';
import sweetAlert from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [loginData,setLoginData] = useState({
        userName:"",
        userPassword:""
    })
    function monitorLogin(event){
        setLoginData((prev)=>({
            ...prev,[event.target.id]:event.target.value
        }))
    }
    async function loginUser(event){
        event.preventDefault();
        try {
            const respLogin = await axios.post('http://localhost:4000/api/vt1/login',loginData);
            if(respLogin.data){
                localStorage.setItem('myToken',respLogin.data.userToken);
                localStorage.setItem('userNo',respLogin.data.userNo);
                sweetAlert.fire({
                    title:respLogin.data.message,
                    icon:"success"
                })
            }
            navigate("/home");
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
    return (
        <div className='login-body'>
            <div className="card my-3 shadow login-card-body" >
                <div className="row g-0">
                    <div className="col-md-4 login-column-1 text-center">
                        <h3>Welcome Back</h3>
                        <img src={logo} alt='logo image' height='150vh'></img>
                    </div>
                    <div className="col-md-8 login-column-2">
                        <div className="card-body">
                            <h3 className="card-title px-3 py-2"><b>Login</b></h3>
                            <form className='px-3' onSubmit={loginUser}>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="userName" value={loginData.userName} onChange={monitorLogin} placeholder='Username' required/>
                                </div>
                                <div className="mb-3">
                                    <input type="password" className="form-control" id="userPassword" value={loginData.userPassword} onChange={monitorLogin} placeholder='Password' required/>
                                </div>
                                <input type="submit" className="btn btn-dark login-btn" value='login'/>
                            </form>
                            <p className="card-text mt-4 px-3"><small className="text-body-secondary">Don't have an account? </small><a href='/signup'><b>Register here.</b></a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
