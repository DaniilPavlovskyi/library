import React from "react";
import Header from "../default/Header";
import Navigation from "../default/Navigation";
import Footer from "../default/Footer";

const MainSection = () => (
    <section>
        <h2>Welcome to E-LitHub: Your Gateway to Endless Reading Adventures!</h2> <br/>
        <h3>Discover the joy of reading with E-LitHub, <br/>
            your premier destination for hassle-free book borrowing. <br/>
            Whether you're an avid reader or just starting your literary journey, <br/>
            we've got you covered.
        </h3>
    </section>
);

const HomePage = () => (
    <div>
        <Header/>
        <Navigation/>
        <MainSection/>
        <Footer/>
    </div>
);

export default HomePage;