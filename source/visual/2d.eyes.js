import {canvasContext} from './canvas'
import { clamp, TAU } from "../maths/maths"
import PALETTE, { DEFAULT_COLOURS } from "../palette"

const DEFAULT_OPTIONS = {
	// colourful part of the eye
	iris:"rgba(100,255,100,0.8)", 
	irisRadius : 1,
	// holes in the eyes
	pupil:"rgba(0,0,0,0.8)",
	pupilRadius:0.3,
	// big white bit of the eye
	sclera:'white',
	scleraRadius:4,
	outline:false
}

/**
 * Draw an Eye from the EYE Model object
 * @param {Array<Object>} keypoints 
 * @param {Boolean} isLeft - draw left eye?
 * @param {Boolean} open - is the eye open
 * @param {Number} eyeDirection - stereo gaze direction
 * @param {Object} options 
 */
export const drawEye = ( keypoints, isLeft=true, open=true, eyeDirection=0, options=DEFAULT_OPTIONS ) => {
	
	const irisData = isLeft ? keypoints.leftIris : keypoints.rightIris
	const eyeData = isLeft ? keypoints.leftEye : keypoints.rightEye
	const pupil = isLeft ? keypoints.leftPupil : keypoints.rightPupil
	
	//console.error("Draw Eyes", {pupil, inner, outer, up, down},  {eyeData, open, isLeft, eyeDirection, options} )
	
	const showRatio = options.ratio || 0.8 

	const radius = pupil.diameter * 0.5
	
	// console.log( {eyeData, irisWidth,irisHeight, diameter, options })

	canvasContext.strokeWidth = 0
	
	// draw iris path

	// arc(x, y, radius, startAngle, endAngle, counterClockwise) 
	// straight lines
	// canvasContext.moveTo(up.x, up.y)
	// canvasContext.lineTo(inner.x, inner.y)
	// canvasContext.lineTo(down.x, down.y)
	// canvasContext.lineTo(outer.x, outer.y)
	// canvasContext.moveTo(up.x, up.y)
	// canvasContext.arcTo(inner.x, inner.y)
	// canvasContext.arcTo(down.x, down.y)
	// canvasContext.arcTo(outer.x, outer.y)
	// canvasContext.arcTo(up.x, up.y)

	if (open)
	{
		// round no perspective...
		const scleraRadius = radius * options.scleraRadius
		const irisRadius = radius * options.irisRadius
		const pupilRadius = radius * options.pupilRadius
		const socketRadius = scleraRadius - irisRadius
		const eyeOffset =  socketRadius * -eyeDirection
		
		// SCLERA - the white stuff... 
		canvasContext.beginPath()
		if (options.outline)
		{
			// this could be wrapped in the eye socket...
			eyeData.forEach( data => {
				canvasContext.lineTo(data.x, data.y)
			})
			
		}else{
			// or as a funky overlay
			canvasContext.arc(pupil.x + eyeOffset, pupil.y, scleraRadius, 0, TAU)
		}

		canvasContext.fillStyle  = options.sclera
		canvasContext.fill()
		canvasContext.closePath()	

		// IRIS - two different styles... 
		// 1. Circular Eyes
		// 2. Frank Sidebottom Eyes
		canvasContext.beginPath()
		canvasContext.fillStyle  = options.iris

		// pie chart eyes because of showRatio
		canvasContext.arc(
			pupil.x, pupil.y, 
			irisRadius, 0, 
			TAU * showRatio 
		)
		canvasContext.lineTo(pupil.x, pupil.y)
		canvasContext.fill()
		canvasContext.closePath()

		// canvasContext.arcTo(up.x, up.y, inner.x, inner.y, options.irisRadius)
		// canvasContext.arcTo(inner.x, inner.y, down.x, down.y, options.irisRadius)
		// canvasContext.arcTo(down.x, down.y, outer.x, outer.y, options.irisRadius)
		// canvasContext.arcTo(outer.x, outer.y, up.x, up.y, options.irisRadius)
		// canvasContext.fill()
		//canvasContext.arc(pupil.x, pupil.y, radius * options.irisRadius, 0, TAU)
		// canvasContext.ellipse(pupil.x, pupil.y, irisWidth, irisHeight, 0, 0, TAU)
		// canvasContext.ellipse(pupil.x, pupil.y, irisHeight, irisWidth, 0, 0, TAU)
		

		// PUPILS
		// 1 + clamp( (10+iris[2]) * 0.8, 5, 10 )
		canvasContext.beginPath()
		canvasContext.fillStyle = options.pupil
		canvasContext.arc(
			pupil.x, pupil.y, 
			pupilRadius, 0, 
			TAU
		)
		canvasContext.fill()

	}else{

		// ---- EYES CLOSED -----
		const eyeLid =  isLeft ? keypoints.leftEye : keypoints.rightEye

		// draw cute triangle
		canvasContext.beginPath()
		canvasContext.lineStyle = options.iris
		canvasContext.fillStyle = options.pupil
		canvasContext.moveTo(eyeLid[ 0 ].x, eyeLid[ 0 ].y )
		canvasContext.lineTo(eyeLid[ 4 ].x, eyeLid[ 4 ].y )
		canvasContext.lineTo(eyeLid[ 6 ].x, eyeLid[ 6 ].y )
		canvasContext.closePath()
		canvasContext.stroke()
		canvasContext.fill()

		// canvasContext.fillRect( 
		// 	(!isLeft ? inner.x : outer.x), 
		// 	(!isLeft ? inner.y : outer.y), 
		// 	radius * options.scleraRadius, 
		// 	irisHeight 
		// )

		// canvasContext.rect(pupil.x, pupil.y, diameter, diameter * 0.2 )
		// canvasContext.fill()
	}
	

	/*
	radius = 4
	canvasContext.beginPath()
	canvasContext.fillStyle  = 'blue'
	canvasContext.arc(up.x, up.y, radius, 0, TAU)
	canvasContext.fill()
	canvasContext.closePath()

	canvasContext.beginPath()
	canvasContext.fillStyle  = 'purple'
	canvasContext.arc(outer.x, outer.y, radius, 0, TAU)
	canvasContext.fill()
		
	canvasContext.beginPath()
	canvasContext.fillStyle  = 'green'
	canvasContext.arc(down.x, down.y, radius, 0, TAU)
	canvasContext.fill()

	canvasContext.beginPath()
	canvasContext.fillStyle  = 'yellow'
	canvasContext.arc(inner.x, inner.y, radius, 0, TAU)
	canvasContext.fill()
	*/

	/*
	// there are four outer balls
	for (let i = 0  ; i < eye.length -1; i++ ) 
	{
		const x = eye[i].x
		const y = eye[i].y
		const z = eye[i].z || 1

		// const radius = 1 + clamp( (10+z) * 0.8, 5, 10 )
		// canvasContext.arc(x, y, radius, 0, TAU)
		// canvasContext.fill()

		if (i > 0)
		{
			const arcLength = 7 ;//Math.abs( i%2 ? iris - x : iris - y )
			const previous = eye[i-1]
			canvasContext.arcTo(previous.x,previous.y, x,y,arcLength)
		}
	}*/
	// canvasContext.stroke()
}
