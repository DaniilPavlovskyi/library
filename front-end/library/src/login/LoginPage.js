import React, {useState} from 'react';
import Header from "../default/Header";
import Navigation from "../default/Navigation";
import Footer from "../default/Footer";
import './LoginPage.css'
import {useNavigate} from "react-router-dom";

const AuthComponent = () => {
    const [loginFormVisible, setLoginFormVisible] = useState(true);
    const [registerUsername, setRegisterUsername] = useState('')
    const [loginUsername, setLoginUsername] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [loginError, setLoginError] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [registerInfo, setRegisterInfo] = useState('');
    const navigate = useNavigate();

    const toggleForms = () => {
        setLoginFormVisible(!loginFormVisible);
    };

    const showPassword = (id) => {
        const passwordInput = document.getElementById(id);
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginUsername,
                    password: loginPassword,
                }),
            });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('roles', data.roles)
            navigate('/account')
            console.log('Success login');
        } else {
            setLoginError('Wrong username/password')
            console.error('Login failed');
        }

    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: registerUsername,
                password: registerPassword,
            }),
        });

        if (response.ok) {
            setRegisterInfo('Success')
            console.log('Registration successful');
        } else {
            setRegisterError('Register failed: bad login/password or such user exists.')
            console.error('Registration failed');
        }
    };

    return (
        <section>
            <div className="login-form" id="loginForm" style={{display: loginFormVisible ? 'block' : 'none'}}>
                <h2>Login</h2>
                <form onSubmit={handleLoginSubmit}>
                    <label htmlFor="username"></label>
                    <input onChange={(e) => setLoginUsername(e.target.value)} type="text" placeholder="Login"
                           id="username" name="username"
                           required/>

                    <label>
                        <input onChange={(e) => setLoginPassword(e.target.value)} type="password" placeholder="Password"
                               id="l_password"
                               name="password" required/>
                    </label>

                    <br/>
                    <span style={{color: 'red'}}>{loginError}</span>

                    <div>
                        <label>
                            <input
                                style={{
                                    width: '25px', height: '20px', marginRight: '5px', marginTop: '0',
                                    marginBottom: '0px', padding: '0'
                                }}
                                type="checkbox"
                                onClick={() => showPassword('l_password')}
                            />
                            Pokaż hasło
                        </label>
                    </div>

                    <div style={{display: 'flex'}}>
                        <button type="submit">Log in</button>
                        <button type="button" onClick={toggleForms}>
                            Register form
                        </button>
                    </div>
                </form>
            </div>

            <div className="login-form" id="registrationForm" style={{display: loginFormVisible ? 'none' : 'block'}}>
                <h2>Register</h2>
                <form onSubmit={handleRegisterSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Login"
                        className="form-control"
                        pattern="[A-Za-z0-9_]{3,15}"
                        title="Login must consist of letters, numbers and underscores, from 3 to 15 characters"
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        id="r_password"
                        placeholder="Password"
                        className="form-control"
                        pattern="^\S{6,}$"
                        title="The password must be at least 6 characters long and must not contain whitespace characters"
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                    />

                    <br/>
                    <span style={{color: 'green'}}>{registerInfo}</span>
                    <span style={{color: 'red'}}>{registerError}</span>

                    <div>
                        <label>
                            <input
                                style={{
                                    width: '25px', height: '20px', marginRight: '5px', marginTop: '0',
                                    marginBottom: '0px', padding: '0'
                                }}
                                type="checkbox"
                                onClick={() => showPassword('r_password')}
                            />
                            Pokaż hasło
                        </label>
                    </div>

                    <div style={{display: 'flex'}}>
                        <button type="submit">Register</button>
                        <button type="button" onClick={toggleForms}>
                            Login form
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

const LoginPage = () => (
    <div>
        <Header/>
        <Navigation/>
        <AuthComponent/>
        <Footer/>
    </div>
);

export default LoginPage;
