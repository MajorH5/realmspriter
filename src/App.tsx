import React from 'react';
import './App.css';
import ArtEditor from './ArtEditor';

function App() {
  return (
    <div className='flex flex-col justify-center items-center w-full'>
      <ArtEditor></ArtEditor>
      <div className='footer'>
        <div className="copyright">
            © 2024 RealmSpriter. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default App;
