import React, {useEffect, useState} from "react";
import './AccountPage.css'
import Header from "../default/Header";
import Navigation from "../default/Navigation";
import Footer from "../default/Footer";
import {useNavigate} from "react-router-dom";
import BookImage from "../books/book_icon.png";

const AccountPage = () => {
    const [user, setUser] = useState({});
    const [loans, setLoans] = useState([]);
    const [token] = useState(localStorage.getItem('accessToken') || '');
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/account`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    navigate('/login');
                    return;
                }

                const userData = await response.json();
                setUser(userData);
                setLoans(userData.loans)
                console.log(userData)
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUserData();
    }, [navigate, token]);

    const handleFirstNameChange = (event) => {
        const value = event.target.value;
        const isValid = /^[a-zA-Z]*$/.test(value);
        if (isValid) {
            setNewFirstName(value);
        }
        setFirstNameError(isValid ? '' : 'Only letters are allowed');
    };

    const handleLastNameChange = (event) => {
        const value = event.target.value;
        const isValid = /^[a-zA-Z]*$/.test(value);
        if (isValid) {
            setNewLastName(value);
        }
        setLastNameError(isValid ? '' : 'Only letters are allowed');
    };

    const handleEmailChange = (event) => {
        const value = event.target.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setNewEmail(value);
        setEmailError((isValid || value.length === 0) ? '' : 'Invalid email format');
    };
    const handleSaveChanges = async () => {
        try {
            if (emailError) {
                setError('Invalid input. Please check the highlighted fields.');
                return;
            }

            setError('');

            const response = await fetch(
                `http://localhost:8080/api/update-account`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        firstName: newFirstName,
                        lastName: newLastName,
                        email: newEmail,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to update user data: ${response.statusText}`);
            }
            window.location.reload();
            console.log('User data updated successfully');
        } catch (error) {
            console.error('Error updating user data:', error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('roles');
        navigate('/login');
    };

    return (
        <div>
            <Header/>
            <Navigation/>
            <section>
                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    <div>
                        <h2>Your Account Info</h2>
                        <div>
                            <strong>Username:</strong> {user.username}
                        </div>
                        <div>
                            <strong>Email:</strong> {user.email || 'N/A'}
                        </div>
                        <div>
                            <strong>First Name:</strong> {user.firstName || 'N/A'}
                        </div>
                        <div>
                            <strong>Last Name:</strong> {user.lastName || 'N/A'}
                        </div>
                        <div>
                            <strong>Registration Date:</strong> {user.registrationDate || 'N/A'}
                        </div>
                        <button className="acc-button" onClick={handleLogout}>Logout</button>
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <div className="change-item">
                            <h2 style={{textAlign: 'center'}}>Change Info</h2>
                            <label><strong>New First Name: </strong></label>
                            <input
                                type="text"
                                placeholder="Enter new first name"
                                value={newFirstName}
                                onChange={handleFirstNameChange}
                            /> <br/>
                            <span style={{color: 'red'}}>{firstNameError}</span>
                        </div>
                        <div className="change-item">
                            <label><strong>New Last Name: </strong></label>
                            <input
                                type="text"
                                placeholder="Enter new last name"
                                value={newLastName}
                                onChange={handleLastNameChange}
                            /> <br/>
                            <span style={{color: 'red'}}>{lastNameError}</span>
                        </div>
                        <div className="change-item">
                            <label><strong>New Email: </strong></label>
                            <input
                                type="email"
                                placeholder="Enter new email"
                                value={newEmail}
                                onChange={handleEmailChange}
                            /> <br/>
                            <span style={{color: 'red'}}>{emailError}</span>
                        </div>
                        <button className="acc-button" onClick={handleSaveChanges}>Save Changes</button>
                        <br/>
                        <span style={{color: 'red'}}>{error}</span>
                    </div>
                    <div style={{textAlign: 'left'}}>
                        <h2 style={{textAlign: 'center'}}>Loans</h2>
                        {loans.length === 0 ? (
                            <h3>No loans</h3>
                        ) : (
                            <>
                                {loans.map((loan) => (
                                    <li key={loan.id} className="loan-item">
                                        Title: <span>{loan.title} | </span>
                                        Start: <span>{loan.start} | </span>
                                        End: <span>{loan.end} | </span>
                                        Status: <span>{loan.status}</span>
                                    </li>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default AccountPage;


