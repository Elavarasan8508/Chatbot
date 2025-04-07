import './LoginPage.css';
import { useState } from 'react';
import { LoginApi } from '../services/Api';
import {storeUserData } from '../services/Storage'
import { isAuthenticated } from '../services/Auth';
import { Link, Navigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useAuth} from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage (){
    const initialStateErrors = {
        email:{required:false},
        password:{required:false},
        custom_error:null
    };
    const [errors,setErrors] = useState(initialStateErrors);
    const [loading,setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [inputs,setInputs] = useState({
        email:"",
        password:"",
    })

    const handleInput = (event)=>{
        setInputs({...inputs,[event.target.name]:event.target.value})
    }

    const handleSubmit = (event)=>{
        event.preventDefault();
        let errors =initialStateErrors; 
        let hasError = false; 
        
        if (inputs.email == "") {
            errors.email.required =true;
            hasError=true;
        }
        if (inputs.password == "") {
            errors.password.required =true;
            hasError=true;
        }
       
        if (!hasError) {
            setLoading(true)
            LoginApi(inputs).then((response)=>{
               storeUserData(response.data.idToken);
            }).catch((err)=>{
               if (err.code="ERR_BAD_REQUEST") {
                    setErrors({...errors,custom_error:"Invalid Credentials."})
               }
            }).finally(()=>{
                setLoading(false)
            })
        }
        setErrors({...errors});
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (isAuthenticated()) {
        return <Navigate to="/dashboard" />
    }

    return (
        <div>
            <NavBar/>
            <section className="login-block">
                <div className="container">
                    <div className="row">
                        <div className="col login-sec">
                            <h2 className="text-center">Login Now</h2>
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label className="text-uppercase">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        onChange={handleInput} 
                                        name="email" 
                                        placeholder="email" 
                                    />
                                    {errors.email.required && (
                                        <span className="text-danger">Email is required.</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="text-uppercase">Password</label>
                                    <div className="password-input-container">
                                        <input 
                                            className="form-control" 
                                            type={showPassword ? "text" : "password"} 
                                            onChange={handleInput}  
                                            name="password" 
                                            placeholder="password" 
                                        />
                                        <button 
                                            type="button" 
                                            className="password-toggle-btn"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.password.required && (
                                        <span className="text-danger">Password is required.</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    {loading && (
                                        <div className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                    {errors.custom_error && (
                                        <span className="text-danger">
                                            <p>{errors.custom_error}</p>
                                        </span>
                                    )}
                                    <input 
                                        type="submit" 
                                        className="btn btn-login float-right" 
                                        disabled={loading}  
                                        value="Login" 
                                    />
                                </div>
                                <div className="clearfix"></div>
                                <div className="form-group">
                                    Create new account ? Please <Link to="/register">Register</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}