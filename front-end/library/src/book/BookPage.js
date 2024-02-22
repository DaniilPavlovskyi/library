import React, {useEffect, useState} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import BookImage from "../books/book_icon.png";
import "./BookPage.css";
import Header from "../default/Header";
import Navigation from "../default/Navigation";
import Footer from "../default/Footer";

const BookPage = () => {
    const {bookId} = useParams();
    const rolesString = localStorage.getItem('roles') || '';
    const roles = rolesString.split(',');
    const [book, setBook] = useState({});
    const [author, setAuthor] = useState({});
    const [token] = useState(localStorage.getItem("accessToken") || "");
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [newPublicationYear, setNewPublicationYear] = useState(1);
    const [newAvailability, setNewAvailability] = useState(-1);

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const [loanDate, setLoanDate] = useState(getCurrentDate());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookData = async () => {
            const response = await fetch(`http://localhost:8080/api/books/${bookId}`);
            const data = await response.json();
            setBook(data);
            setAuthor(data.author);
        };
        fetchBookData();
    }, [bookId, token]);

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/update-book`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id: bookId,
                        title: newTitle,
                        category: newCategory,
                        author: newAuthor,
                        publicationYear: newPublicationYear,
                        availability : newAvailability
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to update book data: ${response.statusText}`);
            }
            window.location.reload();
            console.log('Book data updated successfully');
        } catch (error) {
            console.error('Error updating book data:', error.message);
        }
    };

    const handleDelete = async () => {
        const isConfirmed = window.confirm("Are you sure you want to delete this book?");

        if (!isConfirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/delete-book/` + bookId,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to delete book: ${response.statusText}`);
            }
            navigate('/books')
            console.log('Book deleted successfully');
        } catch (error) {
            console.error('Error deleting book', error.message);
        }
    };

    const handleLoan = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/new-loan/`+bookId,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        date: loanDate
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to create loan: ${response.statusText}`);
            }
            window.location.reload();
            console.log('Success');
        } catch (error) {
            console.error('Error creating loan:', error.message);
        }
    };


    return (
        <div className="book-page-container">
            <Header/>
            <Navigation/>
            <section>
                <div className="book-details" style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    <div>
                        <img className="book-image" src={BookImage} alt="book"/>
                        <p>
                            <strong>Title:</strong> <span>{book.title}</span>
                        </p>
                        <p>
                            <strong>Category:</strong> <span>{book.category}</span>
                        </p>
                        <p>
                            <strong>Author:</strong>{" "}
                            <Link to={`/author/${author.id}`} className="author-link">
                                {author.name}
                            </Link>
                        </p>
                        <p>
                            <strong>Publication year:</strong>{" "}
                            <span>{book.publicationYear}</span>
                        </p>
                        <p>
                            <strong>Availability:</strong>{" "}
                            <span>{book.present ? "Present" : "Not Present"}</span>
                        </p>
                    </div>
                    <div>
                        {roles.includes('ADMIN') ? (
                            <div style={{textAlign: 'right'}}>
                                <div className="change-book">
                                    <h2 style={{textAlign: 'center'}}>Change Book</h2>
                                    <label><strong>New Title: </strong></label>
                                    <input
                                        type="text"
                                        placeholder="Enter new title"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                    />
                                </div>
                                <div className="change-book">
                                    <label><strong>New Category: </strong></label>
                                    <input
                                        type="text"
                                        placeholder="Enter new category"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                </div>
                                <div className="change-book">
                                    <label><strong>New Author: </strong></label>
                                    <input
                                        type="text"
                                        placeholder="Enter new author"
                                        value={newAuthor}
                                        onChange={(e) => setNewAuthor(e.target.value)}
                                    />
                                </div>
                                <div className="change-book">
                                    <label><strong>New Publication Year: </strong></label>
                                    <input
                                        type="number"
                                        placeholder="Enter new publication year"
                                        onChange={(e) => setNewPublicationYear(parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="change-book">
                                    <label><strong>New Availability: </strong></label>
                                    <input
                                        type="number"
                                        placeholder="0 - no, any number - yes"
                                        onChange={(e) => setNewAvailability(parseInt(e.target.value))}
                                    />
                                </div>
                                <button className="book-button" onClick={handleSaveChanges}>Save Changes</button>
                                <br/>
                                <button className="book-button" onClick={handleDelete}>Delete book</button>
                            </div>
                        ) : ('')}
                    </div>
                    <div>
                        {(roles.includes('USER') && book.present) ? (
                            <div style={{display: 'flex', flexDirection:'column'}}>
                                <h2>Loan book</h2>
                                <label htmlFor="loanDate">Loan Date:</label>
                                <input
                                    type="date"
                                    id="loanDate"
                                    name="loanDate"
                                    min={getCurrentDate()}
                                    value={loanDate}
                                    onChange={(e) => setLoanDate(e.target.value)}
                                />
                                <button className="book-button" onClick={handleLoan}>Loan book</button>
                            </div>
                        ) : ('')}
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );

};

export default BookPage;