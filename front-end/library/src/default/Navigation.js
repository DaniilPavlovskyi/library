import { Link } from 'react-router-dom';

const Navigation = () => {
    const rolesString = localStorage.getItem('roles') || '';
    const roles = rolesString.split(',');

    return (
        <nav>
            <div style={{ display: 'flex', width:'95%', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex' }}>
                    <Link to="/">Main</Link>
                    <Link to="/books">All books</Link>
                    {roles.includes('ADMIN') ? (
                        <Link to="/new-book">Add new book</Link>
                    ) : ('')}
                </div>
                <div style={{ display: 'flex' }}>
                    {roles.includes('USER') ? (
                        <Link to="/account">My account</Link>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
