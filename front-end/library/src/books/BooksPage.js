import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BooksPage.css';
import BookImage from './book_icon.png';
import Header from '../default/Header';
import Navigation from '../default/Navigation';
import Footer from '../default/Footer';

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [token] = useState(localStorage.getItem('accessToken') || '');

    const navigate = useNavigate();

    const handlePageClick = (page) => {
        setCurrentPage(page);
        navigate(`/books`);
    };

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(`http://localhost:8080/api/books?page=${currentPage}`);
            const data = await response.json();
            console.log(data);
            setBooks(data.books);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        };

        fetchBooks();
    }, [currentPage, token]);

    return (
        <div>
            <Header />
            <Navigation />
            <section>
                {books.length === 0 ? (
                    <h1>No books</h1>
                ) : (
                    <>
                        <ul className="books-grid">
                            {books.map((book) => (
                                <li key={book.id} className="book-item">
                                    <Link to={`/books/${book.id}`}>
                                        <img src={BookImage} alt="book" />
                                        <br />
                                        Title: <span>{book.title}</span>
                                        <br />
                                        Category: <span>{book.category}</span>
                                        <br />
                                        Availability: <span>{book.present ? 'Present' : 'Not Present'}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {totalPages > 1 && (
                            <div className="pagination">
                                {[...Array(totalPages)].map((_, index) => (
                                    <a
                                        key={index}
                                        href={`#?page=${index + 1}`}
                                        onClick={() => handlePageClick(index + 1)}
                                        style={{ marginRight: '8px' }}
                                    >
                                        {index + 1}
                                    </a>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
            <Footer />
        </div>
    );
};

export default BooksPage;
