import './LoginPage.css';
import { useState, useEffect } from 'react';
import { LoginApi } from '../services/Api';
import { storeUserData } from '../services/Storage';
import { isAuthenticated } from '../services/Auth';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
    const initialStateErrors = {
        email: { required: false },
        password: { required: false },
        custom_error: null
    };

    const [errors, setErrors] = useState(initialStateErrors);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleInput = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let validationErrors = { ...initialStateErrors };
        let hasError = false;

        // Validation
        if (!inputs.email) {
            validationErrors.email.required = true;
            hasError = true;
        }
        if (!inputs.password) {
            validationErrors.password.required = true;
            hasError = true;
        }

        setErrors(validationErrors);

        if (hasError) return;

        try {
            setLoading(true);
            const response = await LoginApi(inputs);
            console.log("✅ Login success:", response.data);

            storeUserData(response.data.idToken); // Store token
            navigate("/dashboard"); // Navigate to dashboard
        } catch (err) {
            console.error("❌ Login failed:", err);

            const errorMessage = err?.response?.data?.error?.message;

            let custom_error = "Something went wrong!";
            if (errorMessage === "INVALID_PASSWORD" || errorMessage === "EMAIL_NOT_FOUND") {
                custom_error = "Invalid email or password.";
            }

            setErrors({ ...initialStateErrors, custom_error });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <NavBar />
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
                                        placeholder="Enter your email"
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
                                            placeholder="Enter your password"
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
                                    Create new account? Please <Link to="/register">Register</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
