import React, { useState , useEffect} from 'react';
import '../src/index.css';
import axios from 'axios';
import validator from 'validator';
import toast from 'react-hot-toast';
import {Toaster} from 'react-hot-toast';
function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urls, setUrls] = useState([]);

  useEffect (() => {
    console.log("urls");
  },[urls]) ;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if (!validator.isURL(longUrl)) {
        toast.error("enter valid url!");
        return;
      }
      const response = await axios.post('http://localhost:8080/api/shorten', {
        originalUrl: longUrl,
      });
      
      setShortUrl(response.data.shortUrl);
      fetchUrls();

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUrls = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/shortened');
      setUrls(response.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const handleShortUrlClick = async (shortCode) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/short/${shortCode}`);
      const originalUrl = response.data;
      window.open(originalUrl, '_blank'); // Redirect the user to the original URL
    } catch (error) {
      console.error('Error fetching URL:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position='top-center' reverseOrder="false"></Toaster>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">URL Shortener</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label className="sr-only">
                Long URL
              </label>
              <input
                id="longUrl"
                name="longUrl"
                type="text"
                required
                value = {longUrl}
                onChange = {(e) => setLongUrl(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your long URL here"
                
                
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Shorten URL
            </button>
          </div>
        </form>
          <div className="bg-white rounded-md shadow-sm p-4">
            <p className="text-center">Shortened URL:</p>
            <div className="bg-indigo-100 text-indigo-800 p-2 mt-2 rounded-md">
              <p className="text-center">{shortUrl}</p>
            </div>
          </div>

        <div>
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
                <tr key={url.short_code} onClick={() => handleShortUrlClick(url.short_code)}>
                  <td className="px-6 py-4 whitespace-nowrap">{url.original_url}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{`http://localhost:8080/${url.short_code}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{url.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
