import React from 'react';
import logo from './logo.svg';
import './App.css';

function Attributes(){
  return(
    <div style={{width: "40%", display: 'inline-block'}}>
      <h2>Num and hours</h2>
    </div>
    );
}

function Search(){
  return(
    <div>
    <input type="text"/>
    </div>
    );
}

function Playlist(){
  return(
  <div style={{width: "15%", display:'inline-block'}}>
  <h3>Playlist name</h3>
  <ul><li>Song1</li><li>Song2</li><li>Song3</li></ul>
  </div>
  );
}





function App() {
  return (
    <div className="App">
      <h1>Title</h1>
      <Attributes/>
      <Attributes/>
      <Search/>
	  <Playlist/>
	  <Playlist/>
	  <Playlist/>
	  <Playlist/>

    </div>
  );
}

export default App;
