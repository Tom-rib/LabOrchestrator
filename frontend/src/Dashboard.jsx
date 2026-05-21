import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user, onLogout }) => {
    const [labs, setLabs] = useState([]);
    const [quotas, setQuotas] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedLabType, setSelectedLabType] = useState('rhcsa');
    const [error, setError] = useState('');

    const LAB_TYPES = {
        rhcsa: { name: 'RHCSA', cpu: 2, memory: 2, storage: 20, hours: 2 },
        docker: { name: 'Docker', cpu: 4, memory: 4, storage: 30, hours: 3 },
        kubernetes: { name: 'Kubernetes', cpu: 4, memory: 8, storage: 50, hours: 4 },
        ctf: { name: 'CTF', cpu: 2, memory: 2, storage: 20, hours: 2 },
        terraform: { name: 'Terraform', cpu: 4, memory: 4, storage: 30, hours: 3 },
        ansible: { name: 'Ansible', cpu: 2, memory: 3, storage: 25, hours: 2 }
    };

    const getAuthHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchLabs = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE || 'http://localhost:3001'}/api/labs`,
                getAuthHeader()
            );
            setLabs(response.data.data);
        } catch (err) {
            console.error('Error fetching labs:', err);
        }
    };

    const fetchQuotas = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE || 'http://localhost:3001'}/api/quotas`,
                getAuthHeader()
            );
            setQuotas(response.data);
        } catch (err) {
            console.error('Error fetching quotas:', err);
        }
    };

    useEffect(() => {
        fetchLabs();
        fetchQuotas();
        const interval = setInterval(() => {
            fetchLabs();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleCreateLab = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE || 'http://localhost:3001'}/api/labs`,
                { lab_type: selectedLabType },
                getAuthHeader()
            );

            setLabs([response.data, ...labs]);
            await fetchQuotas();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create lab');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLab = async (labId) => {
        if (!window.confirm('Are you sure you want to delete this lab?')) return;

        try {
            await axios.delete(
                `${process.env.REACT_APP_API_BASE || 'http://localhost:3001'}/api/labs/${labId}`,
                getAuthHeader()
            );

            setLabs(labs.filter(lab => lab.id !== labId));
            await fetchQuotas();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete lab');
        }
    };

    const getQuotaPercentage = (used, max) => max > 0 ? (used / max * 100) : 0;

    const getProgressColor = (percentage) => {
        if (percentage < 70) return '#4caf50';
        if (percentage < 90) return '#ff9800';
        return '#f44336';
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>🔬 Dashboard</h1>
                    <p>Welcome, <strong>{user.username}</strong>!</p>
                </div>
                <button onClick={onLogout} className="logout-button">Logout</button>
            </header>

            <div className="dashboard-content">
                {/* CREATE LAB SECTION */}
                <section className="create-lab-section">
                    <h2>🚀 Create New Lab</h2>
                    <div className="lab-selector">
                        <select 
                            value={selectedLabType} 
                            onChange={(e) => setSelectedLabType(e.target.value)}
                            disabled={loading}
                        >
                            {Object.entries(LAB_TYPES).map(([type, info]) => (
                                <option key={type} value={type}>
                                    {info.name} - CPU: {info.cpu}, RAM: {info.memory}GB, Storage: {info.storage}GB
                                </option>
                            ))}
                        </select>
                        <button 
                            onClick={handleCreateLab} 
                            disabled={loading}
                            className="create-button"
                        >
                            {loading ? 'Creating...' : 'Launch Lab'}
                        </button>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                </section>

                {/* QUOTAS SECTION */}
                {quotas && (
                    <section className="quotas-section">
                        <h2>📊 Your Quotas</h2>
                        <div className="quotas-grid">
                            <div className="quota-item">
                                <label>Labs</label>
                                <div className="quota-bar">
                                    <div 
                                        className="quota-fill"
                                        style={{
                                            width: `${getQuotaPercentage(quotas.used_labs, quotas.max_labs)}%`,
                                            backgroundColor: getProgressColor(getQuotaPercentage(quotas.used_labs, quotas.max_labs))
                                        }}
                                    ></div>
                                </div>
                                <p>{quotas.used_labs} / {quotas.max_labs}</p>
                            </div>

                            <div className="quota-item">
                                <label>CPU Cores</label>
                                <div className="quota-bar">
                                    <div 
                                        className="quota-fill"
                                        style={{
                                            width: `${getQuotaPercentage(quotas.used_cpu, quotas.max_cpu)}%`,
                                            backgroundColor: getProgressColor(getQuotaPercentage(quotas.used_cpu, quotas.max_cpu))
                                        }}
                                    ></div>
                                </div>
                                <p>{quotas.used_cpu} / {quotas.max_cpu} vCores</p>
                            </div>

                            <div className="quota-item">
                                <label>RAM</label>
                                <div className="quota-bar">
                                    <div 
                                        className="quota-fill"
                                        style={{
                                            width: `${getQuotaPercentage(quotas.used_memory_gb, quotas.max_memory_gb)}%`,
                                            backgroundColor: getProgressColor(getQuotaPercentage(quotas.used_memory_gb, quotas.max_memory_gb))
                                        }}
                                    ></div>
                                </div>
                                <p>{quotas.used_memory_gb} / {quotas.max_memory_gb}GB</p>
                            </div>

                            <div className="quota-item">
                                <label>Storage</label>
                                <div className="quota-bar">
                                    <div 
                                        className="quota-fill"
                                        style={{
                                            width: `${getQuotaPercentage(quotas.used_storage_gb, quotas.max_storage_gb)}%`,
                                            backgroundColor: getProgressColor(getQuotaPercentage(quotas.used_storage_gb, quotas.max_storage_gb))
                                        }}
                                    ></div>
                                </div>
                                <p>{quotas.used_storage_gb} / {quotas.max_storage_gb}GB</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* MY LABS SECTION */}
                <section className="labs-section">
                    <h2>💻 My Labs</h2>
                    {labs.length === 0 ? (
                        <p className="no-labs">No labs created yet. Create one to get started!</p>
                    ) : (
                        <div className="labs-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>IP Address</th>
                                        <th>Status</th>
                                        <th>SSH Command</th>
                                        <th>Created</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {labs.map(lab => (
                                        <tr key={lab.id}>
                                            <td><strong>{lab.lab_type}</strong></td>
                                            <td><code>{lab.ip_address || 'N/A'}</code></td>
                                            <td>
                                                <span className={`status status-${lab.status || 'pending'}`}>
                                                    {lab.status || 'booting'}
                                                </span>
                                            </td>
                                            <td>
                                                <code className="ssh-cmd">
                                                    ssh root@{lab.ip_address || 'xxx.xxx.xxx.xxx'}
                                                </code>
                                                <button 
                                                    onClick={() => navigator.clipboard.writeText(`ssh root@${lab.ip_address}`)}
                                                    className="copy-button"
                                                >
                                                    Copy
                                                </button>
                                            </td>
                                            <td>{new Date(lab.created_at).toLocaleString()}</td>
                                            <td>
                                                <button 
                                                    onClick={() => handleDeleteLab(lab.id)}
                                                    className="delete-button"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
