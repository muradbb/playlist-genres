import React from 'react';
import logo from './logo.svg';
import './App.css';
import queryString from 'query-string'

let playlistStyle={
	width: '200px',
	height:'340px',
	display:'inline-block',
	//border: '1px solid green',
	margin: '20px',
	'background-color': '#212121'
}
let songStyle={
	color: '#ababab'
}

let loginPageStyle={

}

let headerStyle={
	'background-color': '#212121',
	'margin': '20px'


}

class PlaylistCounter extends React.Component{
	render(){
  return(
    <div style={{width: "40%", display: 'inline-block'}}>
      <h2 style={{color:'#535353', 'margin-left':'5%'}}>Playlists on display: {this.props.playlists.length}</h2>
    </div>
    );}
}

class TotalHours extends React.Component{
	render(){
		let allSongs=this.props.playlists.reduce((songs,eachPlaylist)=>{
			return songs.concat(eachPlaylist.allSongs)
		} ,[])
		let totalDuration = allSongs.reduce((sum,eachSong)=>{
			return sum+eachSong.duration
		},0)
	  return(
	    <div style={{width: "40%",display: 'inline-block'}}>
	      <h2 style={{'text-align': 'right', color:'#535353'}}>{Math.floor(totalDuration/3600)} hours {Math.round(60*((totalDuration/3600)-Math.floor(totalDuration/3600)))} mins</h2>
	    </div>
	    );
		}
}

 class Search extends React.Component{
	render(){
  return(
    <div>
    <input placeholder="Search for playlists or songs" type="text" onKeyUp={event=>
			this.props.whenTextChange(event.target.value)
		} style={{'height': '25px' , 'width': '400px', 'font-size': '20px', 'margin-left': '33%'}} />
    </div>
    );}
}

class Playlist extends React.Component{
	render(){
		let playlist=this.props.playlist
		return(
		<div style={{...playlistStyle}}>
		<img src={playlist.imageUrl} style={{width:'180px', 'margin-left': '10px', 'margin-top':'10px'}}/>
		<h3 style={{'text-align': 'center',color:'#fff'}}>{playlist.name}</h3>
		<ul>
		{playlist.songs.map(song=>
			<li style={{color: '#878787','list-style-type':'none'}}>{
				song.name.length>20
				? song.name.substr(0, 17).concat("...")
				: song.name}</li>)
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
	 .then(playlistData => {
		 let playlists = playlistData.items
		 let trackDataPromises = playlists.map(playlist => {
			 let responsePromise = fetch(playlist.tracks.href, {
				 headers: {'Authorization': 'Bearer ' + accessToken}
			 })
			 let trackDataPromise = responsePromise
				 .then(response => response.json())
			 return trackDataPromise
		 })
		 let allTracksDataPromises =
					 Promise.all(trackDataPromises)
				 let playlistsPromise = allTracksDataPromises.then(trackDatas => {
					 trackDatas.forEach((trackData, i) => {
						 playlists[i].trackDatas = trackData.items
						 .map(item=>item.track)
						 // .map(trackData=>({
							//  name: trackData.name,
							//  duration: trackData.duration_ms/1000
						 // }))
					 })
					 return playlists
				 })
				 return playlistsPromise
	 })
	 .then(playlists => this.setState({
		 playlists: playlists.map(item => {
			 return {
				 name: item.name,
				 imageUrl: item.images[0].url,
				 songs: item.trackDatas.slice(0,3).map(trackData=>({
					 name: trackData.name,
					 duration: trackData.duration_ms/1000
				 })),
				 allSongs:item.trackDatas.map(trackData=>({
					 duration: trackData.duration_ms/1000}))
			 }
	 })
	 }))


	}
	render(){
		let searchedBarText=this.state.searchString.toLowerCase()
		let searchedPlaylists =
		this.state.user &&
		this.state.playlists
		? this.state.playlists.filter(playlists=>{
			let matchesPlaylist= playlists.name.toLowerCase().includes
			(searchedBarText)
			let matchesTrack=playlists.songs.filter(song=> song.name.toLowerCase().includes(searchedBarText))
			return matchesPlaylist || matchesTrack.length>0
		})
	  : []
		return (
			<div className="App">
			 {this.state.user ?
				<div>
				<div style={{...headerStyle}}>
					<h1 style={{'text-align':'center', color:'#fff'}}>{this.state.user.name}'s playlists</h1>
				  <PlaylistCounter playlists={searchedPlaylists}/>
				  <TotalHours playlists={searchedPlaylists}/>
				</div>
				  <Search whenTextChange={text=> this.setState({searchString : text})}/>
					{		searchedPlaylists.map(playlists=>
							<Playlist playlist={playlists}/>
						)
					}
					</div> : <div style={{}}> <button style={{
						width: '20%',
						height: '40px',
						'border-radius':'18px',
						'margin-left':'40%',
						'margin-top': '10%',
						color: '#1db954',
						'font-size': '130%'
					}}
					onClick={() => {
            window.location = window.location.href.includes('localhost')
						? 'http://localhost:8888/login'
						: 'https://playlist-genres-backend.herokuapp.com/login'}
          }>
					<b>Sign in with spotify</b></button>
					</div>
				}
			</div>
		);
	}
}

export default App;
