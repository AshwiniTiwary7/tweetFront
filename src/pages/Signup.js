import React, { useState } from 'react'
import './Signup.css'
import logo from '../images/logo.png'
import axios from 'axios';
import sweetAlert from 'sweetalert2';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({
        fullName:"",
        userEmail:"",
        userName:"",
        userPassword:""
    })
    function monitorRegister(event){
        setRegisterData((prev)=>({
            ...prev,[event.target.id]:event.target.value
        }))
    }
    async function submitRegister(event){
        event.preventDefault();
        try {
            const respRegister = await axios.post('http://localhost:4000/api/vt1/register',registerData);
            if(respRegister.data){
                sweetAlert.fire({
                    title:respRegister.data.message,
                    icon:"success"
                })
                navigate('/login');
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
    return (
        <div className='signup-body'>
            <div className="card my-3 shadow signup-card-body" >
                <div className="row g-0">
                    <div className="col-md-4 signup-column-1 text-center">
                        <h3>Join Us</h3>
                        <img src={logo} alt='logo image' height='150vh'></img>
                    </div>
                    <div className="col-md-8 signup-column-2">
                        <div className="card-body">
                            <h3 className="card-title px-3 py-2"><b>Register</b></h3>
                            <form className='px-3' onSubmit={submitRegister}>
                                <div className="mb-3">
                                    <input type="text"  className="form-control" id="fullName" value={registerData.fullName} onChange={monitorRegister} placeholder='Full Name' />
                                </div>
                                <div className="mb-3">
                                    <input  type="email" className="form-control" id="userEmail"  value={registerData.userEmail} onChange={monitorRegister} placeholder='Email' aria-describedby="emailHelp" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="userName"  value={registerData.userName} onChange={monitorRegister} placeholder='Username' />
                                </div>
                                <div className="mb-3">
                                    <input type="password" className="form-control" id="userPassword" value={registerData.userPassword} onChange={monitorRegister} placeholder='Password' />
                                </div>
                                <input type="submit" className="btn btn-dark" value='Register'></input>
                            </form>
                            <p className="card-text mt-4 px-3"><small className="text-body-secondary">Already have an account? </small><Link to='/login'><b>Login here.</b></Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
