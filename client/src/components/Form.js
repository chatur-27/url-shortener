import React, { useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import toast,{Toaster} from 'react-hot-toast';

function Form() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validator.isURL(longUrl)) {
        toast.error('Enter a valid URL!');
        return;
      }
      const response = await axios.post('http://localhost:8080/api/shorten', {
        originalUrl: longUrl,
      });

      setShortUrl(response.data.shortUrl);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
    </div>
  );
}

export default Form;
