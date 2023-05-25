import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

const BackupList = () => {
    const [backups, setBackups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBackups();
    }, []);

    const fetchBackups = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/schedule`);
            const backupData = response.data;
            // Extract the repo name from the URL
            const backups = backupData.map((backup) => {
                const urlParts = backup.repository.split('/');
                const repoName = urlParts[urlParts.length - 1];
                return {
                    ...backup,
                    repoName,
                };
            });

            setBackups(backups);

        } catch (error) {
            console.error('Error occurred while fetching backups:', error.message);
        }
    };

    const filteredBackups = backups.filter((backup) =>
        backup.repository.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(filteredBackups)

    const handleDownloadBackup = (backupId) => {
        // Implement the logic to download the backup
        console.log(`Downloading backup with ID: ${backupId}`);
    };

    const handleDeleteBackup = async (backup) => {
        try {
            const resp = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/schedule/${backup.CIDs[0]}`);
            if (resp.status === 200) {
                toast.success('Backup deleted successfully!');
                setBackups(backups.filter((b) => b._id !== backup._id));
            }
        } catch (error) {
            console.error('Error occurred while deleting backup:', error.message);
            toast.error('Error occurred while deleting backup.');
        }
    };


    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Previous Backups</h2>
            <input
                type="text"
                placeholder="Search by repository name"
                className="border border-gray-300 rounded px-2 py-1 mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Show refresh button */}
            <button
                type="button"
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ml-2"
                onClick={fetchBackups}
            >
                Refresh
            </button>
            {filteredBackups.length > 0 ? (
                // the box below is the list of backups
                // The box should be in the centre of the page with its width being 3/4 of the page
                <div className="flex flex-col items-center justify-center">
                    <ul className="divide-y divide-gray-200 border border-gray-300 rounded px-4">
                        {filteredBackups.map((backup) => (
                            <li key={backup._id} className="py-3 sm:py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 min-w-0">
                                        <a
                                            className="text-sm font-medium text-gray-900 truncate"
                                            href={backup.repository}
                                        >
                                            {backup.repoName}
                                        </a>
                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                            {backup.frequency}
                                        </p>
                                    </div>
                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        onClick={() => handleDeleteBackup(backup)}
                                    >
                                        Delete
                                    </button>
                                    <a
                                        href={`https://scheduler.infura-ipfs.io/ipfs/${backup.CIDs[0]}`}
                                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        onClick={() => handleDownloadBackup(backup._id)}
                                    >
                                        Download
                                    </a>
                                </div>
                            </li>
                        ))
                        }
                    </ul >
                </div>
            ) : (
                <p>No backups found.</p>
            )}
        </div >
    );
};

export default BackupList;
