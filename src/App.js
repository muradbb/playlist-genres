import React from 'react';
import logo from './logo.svg';
import './App.css';
import queryString from 'query-string'



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
							{name:'heh song', duration:150}]
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
    <input type="text" onKeyUp={event=>
			this.props.whenTextChange(event.target.value)
		}/>
    </div>
    );}
}

class Playlist extends React.Component{
	render(){
		let playlist=this.props.playlist
		return(
		<div style={{width: "15%", display:'inline-block'}}>
		<img src={playlist.imgageUrl} style={{width:'60px'}}/>
		<h3>{playlist.name}</h3>
		<ul>{playlist.songs.map(song=>
			<li>{song.name}</li>)
			}
		</ul>
		</div>
		);
	}
}





class App extends React.Component {
	constructor(){
		super()
		this.state={
			serverData: {},
			searchString: ''
		}
	}
	componentDidMount(){
		let parsed=queryString.parse(window.location.search)
		let accessToken= parsed.access_token
		if(!accessToken)
			return
		fetch('https://api.spotify.com/v1/me', {
		 headers: {'Authorization': 'Bearer ' + accessToken}
	 }).then(response => response.json())
	 .then(data =>this.setState({user:{name: data.display_name}}))

	 fetch('https://api.spotify.com/v1/me/playlists', {
		headers: {'Authorization': 'Bearer ' + accessToken}
	}).then(response => response.json())
	.then(data =>this.setState({playlists: data.items.map(item=>({
		name: item.name,
		imgageUrl: item.images[0].url,
		songs: []
	}))
		}))


	}
	render(){
		let searchedPlaylists = this.state.user && this.state.playlists
		? this.state.playlists.filter(playlists=>
			playlists.name.toLowerCase().includes(this.state.searchString.toLowerCase())) : []
		return (
			<div className="App">
			 {this.state.user ?
				<div>
					<h1>{this.state.user.name}'s playlists</h1>
				  <PlaylistCounter playlists={searchedPlaylists}/>
				  <TotalHours playlists={searchedPlaylists}/>
				  <Search whenTextChange={text=> this.setState({searchString : text})}/>
					{		searchedPlaylists.map(playlists=>
							<Playlist playlist={playlists}/>
						)
					}
					</div> :  <button onClick={() => {
            window.location = window.location.href.includes('localhost')
						? 'http://localhost:8888/login'
						: 'https://playlist-genres-backend.herokuapp.com/login'}
          }>
					Sign in with Spotify</button>
				}
			</div>
		);
	}
}

export default App;
