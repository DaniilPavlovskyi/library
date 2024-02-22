
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import HomePage from "./home/HomePage";
import BooksPage from "./books/BooksPage";
import BookPage from "./book/BookPage";
import NewBookPage from "./newBook/NewBookPage";
import LoginPage from "./login/LoginPage"
import AccountPage from "./account/AccountPage"
import AuthorPage from "./author/AuthorPage";

const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:bookId" element={<BookPage /> } />
                <Route path="/login" element= {<LoginPage />} />
                <Route path="/account" element= {<AccountPage />} />
                <Route path="/author/:authorId" element= {<AuthorPage />} />
                <Route path="/new-book" element= {<NewBookPage />} />
            </Routes>
        </Router>
    );
};

export default App;
