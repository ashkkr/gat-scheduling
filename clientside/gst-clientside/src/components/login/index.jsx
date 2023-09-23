import { useEffect, useState } from 'react';
import './index.css'
import { handleChange } from '../homepage/index.jsx'
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/esm/Spinner';

function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [isLoggingIn, setLoggingIn] = useState(false);
    const [errorState, setError] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoggingIn(true);
        fetch("http://localhost:3000/users/login", {
            method: "POST",
            body: JSON.stringify({
                "email": loginData.email,
                "password": loginData.password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Incorrect username or password");
            }
        })
            .then((data) => {
                sessionStorage.setItem('token', 'Bearer ' + data.token);
                navigate('/');
            })
            .catch((err) => {
                setLoggingIn(false);
                setError(true);
            });
    }

    return <form onSubmit={handleSubmit}>
        <div class="login-parent">
            <div class="input-div">
                <label for="emailinput">Email</label>
                <input name="email" id="emailinput" class="input-box" type="text"
                    value={loginData.email} onChange={(e) => handleChange(e, loginData, setLoginData)}></input>
            </div>
            <div class="input-div">
                <label for="passwordinput">Password</label>
                <input name="password" id="passwordinput" class="input-box" type="password"
                    value={loginData.password} onChange={(e) => handleChange(e, loginData, setLoginData)}></input>
            </div>
            <div class="input-div">
                {!isLoggingIn ?
                    (<button type="submit" class="login-button btn btn-primary">Login</button>) :
                    (<Spinner animation='border' variant="primary" style={{ margin: "auto" }}></Spinner>)}
            </div>
            {errorState && (<div class="input-div">
                <small class="error-msg">Email not registered or incorrect password</small>
            </div>)}
        </div>
    </form>
}

export default Login;