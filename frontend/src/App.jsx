import React, { useState } from 'react';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setUser(JSON.parse(localStorage.getItem('user')));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
    };

    if (!isLoggedIn) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    if (user?.role === 'admin') {
        return <AdminPanel user={user} onLogout={handleLogout} />;
    }

    return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
