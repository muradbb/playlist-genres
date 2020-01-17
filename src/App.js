import React from 'react';
import logo from './logo.svg';
import './App.css';



let dummyServerData={
	user:{
		name: 'Murad',
		playlists:[
		{
			name : 'cool songs',
			songs: [{name: 'cool song', duration:180},
							{name:'uncool song', duration:120},
							{name:'nice song', duration:150}]
		},
		{
			name : 'okay songs',
			songs: [{name: 'cool song', duration:180},
							{name:'uncool song', duration:120},
							{name:'nice song', duration:150}]
		},
		{
			name : 'bad songs',
			songs: [{name: 'cool song', duration:180},
							{name:'uncool song', duration:120},
							{name:'nice song', duration:150}]
		},
		{
			name : 'yay songs',
			songs: [{name: 'cool song', duration:180},
							{name:'uncool song', duration:120},
							{name:'nice song', duration:150}]
		}

		]
	}
}



class PlaylistCounter extends React.Component{
	render(){
  return(
    <div style={{width: "40%", display: 'inline-block'}}>
      <h2>{this.props.playlists.length} playlists</h2>
    </div>
    );}
}

class TotalHours extends React.Component{
	render(){
		let allSongs=this.props.playlists.reduce((songs,eachPlaylist)=>{
			return songs.concat(eachPlaylist.songs)
		} ,[])
		let totalDuration = allSongs.reduce((sum,eachSong)=>{
			return sum+eachSong.duration
		},0)
	  return(
	    <div style={{width: "40%", display: 'inline-block'}}>
	      <h2>{totalDuration/3600} hours</h2>
	    </div>
	    );
		}
}

 class Search extends React.Component{
	render(){
  return(
    <div>
    <input type="text"/>
    </div>
    );}
}

class Playlist extends React.Component{
	render(){
		return(
		<div style={{width: "15%", display:'inline-block'}}>
		<h3>Playlist name</h3>
		<ul><li>Song1</li><li>Song2</li><li>Song3</li></ul>
		</div>
		);
	}
}





class App extends React.Component {
	constructor(){
		super()
		this.state={serverData: {}}
	}
	componentDidMount(){
		setTimeout(()=>
		this.setState({serverData: dummyServerData}),1000)
	}
	render(){
		return (
			<div className="App">
			 {this.state.serverData.user ?
				<div>
					<h1>{this.state.serverData.user.name}'s playlists</h1>
				  <PlaylistCounter playlists={this.state.serverData.user && this.state.serverData.user.playlists}/>
				  <TotalHours playlists={this.state.serverData.user && this.state.serverData.user.playlists}/>
				  <Search/>
				  <Playlist/>
				  <Playlist/>
				  <Playlist/>
				  <Playlist/>
					</div> : <h1>Loading...</h1>}
			</div>
		);
	}
}

export default App;
