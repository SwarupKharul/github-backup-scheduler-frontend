import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Landing = () => {
    const [repositoryUrl, setRepositoryUrl] = useState('');
    const [backupFrequency, setBackupFrequency] = useState('');
    const [backupLocation, setBackupLocation] = useState('');

    const handleScheduleBackup = async () => {
        try {
            if (backupLocation === "local") {
                console.log("local")
                window.location.href = `${repositoryUrl}/archive/master.zip`;
            } else {
                const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/schedule`, {
                    repositoryUrl,
                    frequency: backupFrequency,
                });
                if (resp.status === 200) {
                    toast.success(resp.data.message);
                } else {
                    toast.error(resp.data.message);
                }

                setRepositoryUrl('');
                setBackupFrequency('');
                setBackupLocation('');
            }
        } catch (error) {
            console.error('Error occurred while scheduling backup:', error.message);
            toast.error('Error occurred while scheduling backup.');
        }
    };

    return (
        <div>

            <div className="container mx-auto p-20">
                <h1 className="text-3xl font-bold mb-4">GitHub Backup Scheduler</h1>
                <div className="mb-4">
                    <label className="block mb-2">Repository URL:</label>
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={repositoryUrl}
                        onChange={(e) => setRepositoryUrl(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Backup Frequency:</label>
                    <select
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={backupFrequency}
                        onChange={(e) => setBackupFrequency(e.target.value)}
                    >
                        <option value="">Select Frequency</option>
                        <option value="now">Every Minute</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Backup Location:</label>
                    <select
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={backupLocation}
                        onChange={(e) => setBackupLocation(e.target.value)}
                    >
                        <option value="">Select Location</option>
                        <option value="local">Local</option>
                        <option value="cloud">Cloud</option>
                    </select>

                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 m-2 rounded"
                    onClick={handleScheduleBackup}
                >
                    Schedule Backup
                </button>
            </div>

        </div>
    );
};

export default Landing;
