import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import Header from "../default/Header";
import Navigation from "../default/Navigation";
import Footer from "../default/Footer";

const AuthorPage = () => {
    const {authorId} = useParams();
    const [author, setAuthor] = useState({});
    const [books, setBooks] = useState([]);
    const [token] = useState(localStorage.getItem("accessToken") || "");

    useEffect(() => {
        const fetchAuthorData = async () => {
            const response = await fetch(`http://localhost:8080/api/author/${authorId}`);
            const data = await response.json();
            setAuthor(data);
            setBooks(data.books);
        };
        fetchAuthorData();
    }, [authorId, token]);

    return (
        <div>
            <Header/>
            <Navigation/>
            <section>
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <div>
                        <h2>{author.name}'s Books</h2>
                        <ul className="list-group">
                            {books.map((book) => (
                                <li key={book.id} className="list-group-item">
                                    <Link to={`/books/${book.id}`}>
                                        <strong>Title:</strong> {book.title} |
                                        <strong> Year:</strong> {book.publicationYear} |
                                        <strong> Category:</strong> {book.category} |
                                        <strong> Availability:</strong> {book.present ? "Present" : "Not Present"}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={{width: '30%'}}>
                        <h2>{author.name}'s Biography</h2>
                        <p>
                            {author.biography}
                        </p>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default AuthorPage;
