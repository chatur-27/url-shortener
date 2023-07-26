import React, { useState, useEffect } from 'react';
import axios from 'axios';

function URLTable() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    fetchUrls();
  }, [urls]);

  const fetchUrls = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/shortened');
      setUrls(response.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  return (
    <div className='flex justify-center'>
      <table className="min-w-full divide-y divide-gray-200 mt-8">
      <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Long URL
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Short URL
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {urls.map((url) => (
                <tr>
                  <td className="px-6 py-4 whitespace-normal max-w-[450px] overflow-hidden overflow-ellipsis">{url.original_url}</td>
                  <td className="px-6 py-4 whitespace-nowrap hover:text-indigo-600 hover:underline cursor-pointer "
                  onClick={() => window.open(`http://localhost:8080/${url.short_code}`, '_blank')}>
                    {`http://localhost:8080/${url.short_code}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{url.count}</td>
                </tr>
              ))}
            </tbody>
      </table>
    </div>
  );
}

export default URLTable;
