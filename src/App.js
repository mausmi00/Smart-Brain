import React from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognation from './components/FaceRecognation/FaceRecognation.js';
import SignIn from './components/SignIn/SignIn.js'
import Register from './components/Register/Register.js'



const particlesOptions = {
  particles: {
      number: {
        value: 60,
        density:{
          enable: true,
          value_area: 100
        }
      }
    }
  }

const initialState = {
 
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id:'',
      name: '',
      email: '',
      entries: 0,
      joined: ''

    }
  

}
class App extends React.Component {  

  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user : {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }
    })
  }
 

  OnInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }

  displayFaceBox = (box) =>{
    this.setState({box: box});
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState)
    }else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
       fetch("http://localhost:300/imageurl", {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            input: this.state.input
            
        })
    })
    .then(response => response.json())
      .then( response => 
        {  if(response){
          fetch("http://localhost:300/image", {
                  method: 'put',
                  headers: {'Content-Type' : 'application/json'},
                  body: JSON.stringify({
                      id: this.state.user.id
                      
                  })
              })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user,{entries: count}))
              })
              .catch(console.log)
        }         
          this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(error => console.log(error)); 
    }
  render(){
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (

    <div className="App">
       <Particles className = 'particles'
                params={particlesOptions} />
      <Navigation isSignedIn = {isSignedIn} onRouteChange={this.onRouteChange} />
      { route === 'home'
      ? <div>
      <Logo />
      <Rank name = {this.state.user.name} entries = {this.state.user.entries}/>
      <ImageLinkForm OnInputChange = {this.OnInputChange} onSubmit = {this.onSubmit} />
      <FaceRecognation box={box} imageUrl= {imageUrl}/>
     </div>
     : (
       this.state.route === 'signin'
       ? <SignIn loadUser={this.loadUser}  onRouteChange = {this.onRouteChange} />
        : <Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
     )     
      }
   </div>
  );
    }
  }

export default App;

