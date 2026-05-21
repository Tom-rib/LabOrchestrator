import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [allLabs, setAllLabs] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAuthHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE || 'http://localhost:3001'}/api/admin/users`,
                getAuthHeader()
            );
            setUsers(response.data.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllLabs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE || 'http://localhost:3001'}/api/admin/labs`,
                getAuthHeader()
            );
            setAllLabs(response.data.data);
        } catch (err) {
            console.error('Error fetching labs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'labs') {
            fetchAllLabs();
        }
    }, [activeTab]);

    if (user.role !== 'admin') {
        return (
            <div className="admin-panel">
                <p style={{ color: 'red', textAlign: 'center' }}>Access Denied: Admin only</p>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <header className="admin-header">
                <h1>👑 Admin Panel</h1>
                <button onClick={onLogout} className="logout-button">Logout</button>
            </header>

            <div className="admin-tabs">
                <button 
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Users ({users.length})
                </button>
                <button 
                    className={`tab-button ${activeTab === 'labs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('labs')}
                >
                    💻 All Labs ({allLabs.length})
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'users' && (
                    <section className="users-section">
                        <h2>User Management</h2>
                        {loading ? (
                            <p>Loading users...</p>
                        ) : users.length === 0 ? (
                            <p>No users found</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td><strong>{user.username}</strong></td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge role-${user.role}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                                                    {user.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <button className="edit-button">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                )}

                {activeTab === 'labs' && (
                    <section className="labs-section">
                        <h2>All Labs</h2>
                        {loading ? (
                            <p>Loading labs...</p>
                        ) : allLabs.length === 0 ? (
                            <p>No labs found</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>User ID</th>
                                        <th>Type</th>
                                        <th>IP Address</th>
                                        <th>VMID</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Destroyed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allLabs.map(lab => (
                                        <tr key={lab.id}>
                                            <td><code>{lab.id.substring(0, 8)}</code></td>
                                            <td>{lab.user_id}</td>
                                            <td><strong>{lab.lab_type}</strong></td>
                                            <td><code>{lab.ip_address || 'N/A'}</code></td>
                                            <td>{lab.vmid || 'N/A'}</td>
                                            <td>
                                                <span className={`status-badge ${lab.destroyed_at ? 'destroyed' : 'running'}`}>
                                                    {lab.destroyed_at ? 'Destroyed' : 'Running'}
                                                </span>
                                            </td>
                                            <td>{new Date(lab.created_at).toLocaleString()}</td>
                                            <td>{lab.destroyed_at ? new Date(lab.destroyed_at).toLocaleString() : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
