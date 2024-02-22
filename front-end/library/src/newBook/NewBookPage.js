import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "../book/BookPage.css";
import Header from "../default/Header";
import Navigation from "../default/Navigation";
import Footer from "../default/Footer";

const NewBookPage = () => {
    const rolesString = localStorage.getItem('roles') || '';
    const roles = rolesString.split(',');
    const [token] = useState(localStorage.getItem("accessToken") || "");
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [newPublicationYear, setNewPublicationYear] = useState(1);
    const [newAvailability, setNewAvailability] = useState(1);

    const navigate = useNavigate();

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/create-book`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: newTitle,
                        category: newCategory,
                        author: newAuthor,
                        publicationYear: newPublicationYear,
                        availability : newAvailability
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to create book: ${response.statusText}`);
            }
            navigate('/books')
            console.log('Book created successfully');
        } catch (error) {

            console.error('Error creating book:', error.message);
        }
    };


    return (
        <div className="book-page-container">
            <Header/>
            <Navigation/>
            <section>
                <div className="book-details" style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    <div>
                        {roles.includes('ADMIN') ? (
                            <div style={{textAlign: 'right'}}>
                                <div className="add-book">
                                    <h2 style={{textAlign: 'center'}}>Create Book</h2>
                                    <label><strong>Title: </strong></label>
                                    <input
                                        type="text"
                                        placeholder="Enter new title"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                    />
                                </div>
                                <div className="add-book">
                                    <label><strong>Category: </strong></label>
                                    <input
                                        type="text"
                                        placeholder="Enter new category"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                </div>
                                <div className="add-book">
                                    <label><strong>Author: </strong></label>
                                    <input
                                        type="text"
                                        placeholder="Enter new author"
                                        value={newAuthor}
                                        onChange={(e) => setNewAuthor(e.target.value)}
                                    />
                                </div>
                                <div className="add-book">
                                    <label><strong>Publication Year: </strong></label>
                                    <input
                                        type="number"
                                        placeholder="Enter new publication year"
                                        onChange={(e) => setNewPublicationYear(parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="add-book">
                                    <label><strong>Availability: </strong></label>
                                    <input
                                        type="number"
                                        placeholder="0 - no, any number - yes"
                                        onChange={(e) => setNewAvailability(parseInt(e.target.value))}
                                    />
                                </div>
                                <button className="book-button" onClick={handleSaveChanges}>Create Book</button>
                                <br/>
                            </div>
                        ) : ('')}
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default NewBookPage;