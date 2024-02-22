import React from "react";
import logoImage from "../logo2.png";

const Header = () => (
    <div className="logo-bar">
        <a href="/">
            <img className="logo-image" src={logoImage} alt="logo" />
        </a>
        Empower Your Mind, One Page at a Time
    </div>
);

export default Header;