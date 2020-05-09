import React from 'react';
import './App.css';
import Clarifai from 'clarifai'
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognation from './components/FaceRecognation/FaceRecognation.js';
import SignIn from './components/SignIn/SignIn.js'
import Register from './components/Register/Register.js'

const app = new Clarifai.App({
  apiKey: '5ced6265d9464f799fc78f4e60a224b5'
 });


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


class App extends React.Component {  

  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
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
      this.setState({isSignedIn: false})
    }else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    console.log('click')
      app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then( response => this.displayFaceBox(this.calculateFaceLocation(response)))
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
      <Rank />
      <ImageLinkForm OnInputChange = {this.OnInputChange} onSubmit = {this.onSubmit} />
      <FaceRecognation box={box} imageUrl= {imageUrl}/>
     </div>
     : (
       this.state.route === 'signin'
       ? <SignIn onRouteChange = {this.onRouteChange} />
        : <Register onRouteChange = {this.onRouteChange}/>


     )
      
      }
      
    </div>
  );
    }
  }

export default App;

