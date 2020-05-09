import React from 'react'
import './FaceRecognation.css'

const FaceRecognation = (props) =>{
    return(
        <div className = 'center ma' >
            <div className = 'absolute mt2'>
            <img id= 'inputImage' alt =' ' src= {props.imageUrl} width='500px' height='auto'/>
            <div className='bounding_box' style = {{top: props.box.topRow, right: props.box.rightCol, bottom: props.box.bottomRow, left: props.box.leftCol} }></div>
            </div>       
        </div>
    )
}

export default FaceRecognation;