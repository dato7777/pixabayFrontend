import React from 'react';
import './css/App.css'
import Categories from './app/Categories';
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Categories></Categories>
      </BrowserRouter>
    </div>
  );
}

export default App;
