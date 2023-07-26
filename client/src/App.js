import React from 'react';
import '../src/index.css';
import Form from './components/Form.js';
import URLTable from './components/URLTable.js';


function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">URL Shortener</h2>
        </div>
        <Form />
        <URLTable />
      </div>
    </div>
  );
}

export default App;
