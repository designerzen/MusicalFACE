// each person in the app has their own instrument and face
import { getBarProgress } from './timing/timing.js'
import { DEFAULT_COLOURS } from './palette'
import { getNoteText, SOLFEGE_SCALE, active, playing, loadInstrument, randomInstrument, playTrack, getNoteName, getNoteSound } from './audio/audio'
import { rescale, easeInSine, easeOutSine , easeInCubic, easeOutCubic, linear, easeOutQuad, lerp, clamp, TAU} from "./maths"
import { INSTRUMENT_FOLDERS, cleanTitle, MUSICAL_NOTES} from './audio/instruments'
import { setupInstrumentForm} from './ui'
import { ParamaterRecorder} from './record'
import { 
	clear,
	drawFace, drawPoints, drawPart, drawEye, drawMouth, drawBoundingBox, 
	drawText,drawParagraph, drawInstrument, drawFaceMesh
} from './visual/2d'

// Maximum simultaneous tracks to play (will wait for slot)
const MAX_TRACKS = 18
const UPDATE_FACE_BUTTON_AFTER_FRAMES = 22

export const NAMES = ['a','b','c'].map( m => `person-${m}` )
export const EYE_COLOURS = ['blue','green','brown','orange']

export const DEFAULT_OPTIONS = {
	...DEFAULT_COLOURS,

	// Passed to the delay node
	delayTime: 0.14,
	delayLength: 10,

	// if you want the axis to be switched
	swapControls:false,

	// if the user has epilepsy, set to true
	photoSensitive:false,

	drawMesh:false,
	drawNodes:true,

	// mouse hold for clicking
	mouseHoldDuration:0.6,
	eyeShutHolddDuration:3500, // ms

	// how much feedback to apply to the feedback node
	feedback:0.1,

	// to adjust the angle that the head has to roll...
	// larger means less movement required
	rollSensitivity:1.2,

	// to adjust the amount of pitching (head rocking)
	// depending on how complicated the piece is the octaves
	// can also be shifted between a certain range...
	pitchSensitivity:1,

	// size of the mouth to signal activity
	mouthCutOff:0.2,

	// size of the mouth to signal silence
	mouthSilence:0.05,

	// volume smooth rate = smaller means faster fades?
	volumeRate:0.7,

	// this is the amount of decimal places used to smooth the mouth
	// the higher the number the less smooth the output is
	// 1 or 2 should be more than enough
	precision:3,

	// set this to one of the interpolation methods above
	// IN means that it starts off slowly (prefered)
	ease:easeInSine // easeInSine // linear
}

export default class Person{

	constructor(name, audioContext, destinationNode, options={} ) {
		
		this.options = Object.assign({}, DEFAULT_OPTIONS, options)
		this.name = name
		this.counter = 0
		// instrument index
		this.index = 0
		this.instrumentLoading = false
		this.data = null
		this.audioContext = audioContext
		this.active = false
		this.tracks = 0
		this.octave = 4
		this.midi = null
		this.midiActive = false
		this.midiChannel = "all"


		// if we are repeating our bars...
		this.isLooping = false
		// if we are watching the face perform without interaction
		this.isPlayingBack = false

		this.hue = options.hue || Math.random() * 360
		this.saturation = 40
		this.precision = Math.pow(10, parseInt(this.options.precision) )
		
		this.parameterRecorder = new ParamaterRecorder( audioContext )

		// Head orientation
		this.yaw = 0
		this.pitch = 0
		this.roll = 0

		this.singing = false
		this.isMouthOpen = false
		this.isLeftEyeOpen = true
		this.isRightEyeOpen = true
		this.isRecordingParameters = false
		this.mouseDownAt = -1
		this.leftEyeClosedAt = -1
		this.rightEyeClosedAt = -1
		this.lastNoteName = "A0"
		this.lastNoteSound = "-"
		this.debug = options.debug || false

		// this.range = 1 / ( 1 - this.options.mouthCutOff )
		this.mouthScale = rescale(this.options.mouthCutOff)

		this.stereoNode = audioContext.createStereoPanner()

		const delayNode = audioContext.createDelay( this.options.delayLength )
		const feedbackNode = audioContext.createGain()
		delayNode.delayTime.value = this.options.delayTime
		feedbackNode.gain.value = this.options.feedback

		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 0

		this.stereoNode.connect(this.gainNode)

		// DELAY
		// this.stereoNode.connect(delayNode)

		// delayNode.connect(feedbackNode)
		// feedbackNode.connect(delayNode)

		// //delayNode.connect(destinationNode)
		// delayNode.connect(this.gainNode)

		this.gainNode.connect(destinationNode)

		// fetch dom element
		this.button = document.getElementById(name)
		this.button.addEventListener( 'mousedown', event => {

			this.mouseDownAt = audioContext.currentTime
			
			// test to see how long we are help down for?
			const waitPatiently = () => {

				const elapsed = this.mouseDownFor
				if ( elapsed < this.options.mouseHoldDuration )
				{
					// ignore?
					//console.log("mouseDownFor", elapsed )

					requestAnimationFrame( waitPatiently )
				}else if (this.isMouseDown){
					// FIXME
					this.mouseDownAt = -1
					this.showForm()
				}
			}
			waitPatiently()
			event.preventDefault()
		})

		// FACE has been pressed!
		this.button.addEventListener( 'mouseup', event => {
			// should this trigger something else depending on time?
			const elapsed = this.mouseDownFor
			//console.log("mouseDownFor", elapsed )

			if (this.instrumentLoading)
			{

			}else{
				this.loadInstrument( randomInstrument() )
			}

			// and reset
			this.mouseDownAt = -1
			event.preventDefault()
		})

		this.button.addEventListener( 'mouseover', event => {
			this.isMouseOver = true
		})
		this.button.addEventListener( 'mouseout', event => {
			this.isMouseOver = false
		})
		// this.button.addEventListener( 'instrumentchange', event => {
		// 	console.log("External event for instrument", event )
		// })
		//console.log("Created new person", this, "connecting to", destinationNode )
	}

	get areEyesOpen(){
		return this.isLeftEyeOpen && this.isRightEyeOpen
	}

	get mouseDownFor(){
		return this.audioContext.currentTime - this.mouseDownAt
	}
	get isMouseDown(){
		return this.mouseDownAt > -1
	}
	get isMouseHeld(){
		return this.options.mouseHoldDuration < this.mouseDownFor
	}

	get controlsID (){
		return `${this.name}-controls`
	}
	get controls (){
		return document.getElementById(this.controlsID)
	}

	get instrumentName(){
		return this.instrument ? this.instrument.name : 'loading'
	}	
	get instrumentTitle(){
		return this.instrument ? this.instrument.title : 'loading'
	}
	get instrumentIndex(){
		return INSTRUMENT_FOLDERS.indexOf(this.instrumentName)
	}

	get hasMIDI(){
		return this.midi !== null && this.midiChannel && this.midiChannel.length > 0
	}

	get MIDIDeviceName(){
		return this.midi ? this.midi.name : 'unknown'
	}

	/////////////////////////////////////////////////////////////////////
	// Return a time based library of face movements since recording began
	/////////////////////////////////////////////////////////////////////
	get history(){
		return this.parameterRecorder.recording
	}

	/////////////////////////////////////////////////////////////////////
	// Cache data for use in processing later
	/////////////////////////////////////////////////////////////////////
	update(prediction){
		
		this.counter++
		this.data = prediction
		
		// save all the parameters for recall later on...
		if (this.isRecordingParameters)
		{
			this.parameterRecorder.save(prediction)
		}
		
		// update any eye states
		if (this.isLeftEyeOpen !== !prediction.leftEyeClosed)
		{
			if (prediction.leftEyeClosed)
			{
				this.onLeftEyeClose( prediction.time )
			}else{
				// open eye
				this.onLeftEyeOpen( prediction.time - this.leftEyeClosedAt )
			}
			// eye state changed
			this.isLeftEyeOpen = !prediction.leftEyeClosed
		}

		if (this.isRightEyeOpen !== !prediction.rightEyeClosed)
		{
			if (prediction.rightEyeClosed)
			{
				this.onRightEyeClose( prediction.time )
				
			}else{
				this.onRightEyeOpen( prediction.time - this.rightEyeClosedAt )
			}
			// eye state changed
			this.isRightEyeOpen = !prediction.rightEyeClosed
		}
		
	}

	/////////////////////////////////////////////////////////////////////
	// Update visuals
	/////////////////////////////////////////////////////////////////////
	draw(prediction, showText=true, forceRefresh=false){
		
		if (!forceRefresh && !prediction && !this.prediction && !this.isPlayingBack)
		{
			// nothing to (re)draw so exit here
			return
		}
		
		if (!prediction || forceRefresh)
		{
			// refresh
			prediction = this.prediction
		}

		if (this.isPlayingBack)
		{
			// TODO:
			// overwrite prediction
		}

		
		let hue = this.hue

		if ( this.instrumentLoading )
		{
			hue += 120
		}

		let saturation = this.saturation

		// can this just be a reference???
		const options = this.options
		// const options = Object.assign( {} , this.options )

		const rightEyeClosedFor = this.isRightEyeOpen ? -1 : prediction.time - this.rightEyeClosedAt
		const leftEyeClosedFor = this.isLeftEyeOpen ? -1 : prediction.time - this.leftEyeClosedAt
		// this.areEyesOpen 

		// update colours...
		options.dots = hue
		options.mouth = `hsla(${(hue+30)%360},${saturation}%,40%,0.8)`
		options.mouthClosed = `hsla(${(hue+30)%360},${saturation}%,10%,0.99)`
		options.lipsUpperInner = `hsla(${(hue+50)%360},${saturation}%,50%,1)`
		options.lipsLowerInner = `hsla(${(hue+50)%360},${saturation}%,50%,1)`
		options.midwayBetweenEyes = `hsla(${(hue+270)%360},${saturation}%,50%,1)`
		options.leftEyeLower0 = `hsla(${(hue+300)%360},${saturation}%,50%,0.8)`
		options.rightEyeLower0 = `hsla(${(hue+300)%360},${saturation}%,50%,0.8)`
		
		// change eye colours if closed...?
		// options.leftEyeIris = `hsla(${(hue+90)%360},${saturation}%,50%,1)`
		// options.rightEyeIris = `hsla(${(hue+90)%360},${saturation}%,50%,1)`
		
		options.leftEyeIris = `hsla(${(this.isLeftEyeOpen ? hue+90 : hue-90)%360},${saturation}%,50%,1)`
		options.rightEyeIris = `hsla(${(this.isRightEyeOpen ? hue+90 : hue-90)%360},${saturation}%,50%,1)`

		// NB. assumes screen has been previously cleared	
		// drawBox( prediction )
		
		
		// mesh
		if (options.drawMesh) 
		{
			drawFaceMesh( prediction, options.dots, this.instrumentLoading, this.debug )
		}
		
		// nodes
		if (options.drawNodes)
		{
			// blobs
			drawPoints( prediction, options.dots, 3, this.instrumentLoading, this.debug )
		}

		// This overlays the mouth and the eyes
		drawFace( prediction, options, this.singing, this.isMouthOpen, this.debug )
	
		// drawBoundingBox( prediction.boundingBox )

		// use the eyes?
		
		// if this is mirrored using the option in the TF model...
		const {bottomRight, topLeft} = prediction.boundingBox
		const boxWidth = Math.abs(bottomRight[0] - topLeft[0])
		const boxHeight = Math.abs(bottomRight[1] - topLeft[1])
			
		// we only want this every frame or so as this 
		// is altering the DOM
		if (this.counter%UPDATE_FACE_BUTTON_AFTER_FRAMES===0)
		{
			// TODO: Profile which is faster...
			// this.button.style.setProperty(`--${this.name}-x`, bottomRight[0] )
			// this.button.style.setProperty(`--${this.name}-y`, topLeft[1] )
			// this.button.style.setProperty(`--${this.name}-w`, boxWidth )
			// this.button.style.setProperty(`--${this.name}-h`, boxHeight )			
			// ?
			this.button.setAttribute( "style", `--${this.name}-x:${bottomRight[0]};--${this.name}-y:${topLeft[1]};--${this.name}-w:${boxWidth};--${this.name}-h:${boxHeight};` );

			// ?
			// this.button.cssText = `--${this.name}-x:${bottomRight[0]};--${this.name}-y:${topLeft[1]};--${this.name}-w:${boxWidth};--${this.name}-h:${boxHeight};`
		}

		// draw silhoette if the user is 
		// if you want it to flicker...
		// interacting&& this.counter%2 === 0)
		const {annotations} = prediction
		const {silhouette} = annotations
		// we need to ignore eyes closed if the instrument is loading...
		const eyesClosedFor = this.instrumentLoading || this.isRightEyeOpen || this.isLeftEyeOpen ? -1 : Math.max(leftEyeClosedFor, rightEyeClosedFor)
		
		// eyes have been closed for X -period of time
		if (eyesClosedFor > options.eyeShutHolddDuration)
		{
			// both eyes are closed for X amount of time...
			console.log("EYES SHUT", {
				rightEyeClosedFor, 
				leftEyeClosedFor, 
				eyesClosedFor, 
				ro:this.isRightEyeOpen,
				lo:this.isLeftEyeOpen,
				time:prediction.time, 
				rca:this.rightEyeClosedAt, 
				lca:this.leftEyeClosedAt
			} )

			// update to reset counter
			this.leftEyeClosedAt = prediction.time
			this.rightEyeClosedAt = prediction.time

			// 
			this.loadNextInstrument( instrumnetName => console.log("instrumnetName",instrumnetName ) )
		
		}else{

			//console.log("EYES", {rightEyeClosedFor, leftEyeClosedFor, eyesClosedFor, time:prediction.time, rca:this.rightEyeClosedAt, lca:this.leftEyeClosedAt} )
			if (this.isLeftEyeOpen)
			{
				drawEye(annotations.leftEyeIris, options.leftEyeIris)	
			}else{
				// const leftEyeHeldShut = prediction.time - this.leftEyeClosedAt > options.eyeShutHolddDuration
				// drawEye(annotations.leftEyeIris, leftEyeHeldShut ?'red' : 'green')	
			}

			if (this.isRightEyeOpen)
			{
				drawEye(annotations.rightEyeIris, options.rightEyeIris)
			}else{
				// const rightEyeHeldShut = prediction.time - this.rightEyeClosedAt > options.eyeShutHolddDuration
				// drawEye(annotations.rightEyeIris,rightEyeHeldShut ? 'red' : 'green')
			}

			// console.log("EYE OPEN", {
			// 	rightEyeClosedFor, 
			// 	leftEyeClosedFor, 
			// 	eyesClosedFor, 
			// 	ro:this.isRightEyeOpen,
			// 	lo:this.isLeftEyeOpen,
			// 	time:prediction.time, 
			// 	rca:this.rightEyeClosedAt, 
			// 	lca:this.leftEyeClosedAt
			// } )
			
		}

		// everything here is for displaying the text
		if (!showText)
		{
			return
		}

		if ( this.isMouseOver || this.instrumentLoading ){

			// draw silhoette directly on the canvas or
			// SVG shape in the button for hitarea?
			// user is interacting...
			if (this.isMouseDown && !this.instrumentLoading)
			{
				// user is holding mouse down on user...
				const remaining = 1 - this.mouseDownFor / this.options.mouseHoldDuration
				const percentageRemaining = 100 - Math.ceil(remaining*100)
				
				if (this.isMouseHeld)
				{
					// user is holding mouse down on user...
					drawInstrument(prediction.boundingBox, this.instrumentTitle, 'Select')			
					drawPart( silhouette, 4, `hsla(${hue},50%,${percentageRemaining}%,0.3)`, true)
					drawParagraph(prediction.boundingBox.topLeft[0], prediction.boundingBox.topLeft[1] + 40, [`Press me`], '14px' )
				}else{
					
					drawInstrument(prediction.boundingBox, this.instrumentTitle, `${100-percentageRemaining}`)			
					drawPart( silhouette, 4, `hsla(${hue},50%,${percentageRemaining}%,0.5)`, true)
					drawParagraph(prediction.boundingBox.topLeft[0], prediction.boundingBox.topLeft[1] + 40, [`Hold me to see all instruments`], '14px' )
				}

			}else{
				
				// No mouse held
				drawInstrument(prediction.boundingBox, this.instrumentTitle, 'Press to change instrument')
				drawPart( silhouette, 4, 'hsla('+hue+',50%,50%,0.3)', true)
				/*	
				const offsetX = topLeft[0]
				const offsetY = topLeft[1]
				const svgCoord = coord => `${boxWidth - (coord[0] - offsetX)} ${(coord[1] - offsetY)}`
				const svgPaths = silhouette.map( part => `L${svgCoord(part)}`)
				const circles = silhouette.map( part =>{
					const c = svgCoord(part)
					return `<circle cx="${c[0] - offsetX}" cy="${c[1]}" r="20" />`
				})
				// for outline...+ ` Z`
				const svgPath = `M${svgCoord(silhouette[0])} ` + svgPaths.join(" ")
				//  height="210" width="400"
				const silhoetteShape = 
				`<svg width="${boxWidth}" height="${boxHeight}" viewBox="0 0 ${boxWidth} ${boxHeight}">
					<path d="${svgPath}" />
					${circles.join('')}
				</svg>`
				//console.log("SVG",silhouette, silhoetteShape)
				this.button.innerHTML = silhoetteShape	
				*/

			}
		
		}else if (this.instrumentLoading){

			// Instrument loading...
			drawInstrument(prediction.boundingBox, this.instrumentTitle, 'loading...')

		}else{

			// Main flow
			const extra = this.debug ? ` ${getNoteText( this.lastNoteName) }`  : ` ${getNoteText(this.lastNoteName)}`
			const suffix = this.singing ? `| ♫ ${this.lastNoteSound}` : this.isMouthOpen ? `<` : `-`
			// const suffix = this.singing ? MUSICAL_NOTES[this.counter%(MUSICAL_NOTES.length-1)] : this.isMouthOpen ? `<` : ` ${this.lastNoteSound}`
			
			// eye:${prediction.eyeDirection}
			drawInstrument(prediction.boundingBox, this.instrumentTitle, `${extra} ${suffix}` )
			
			if (this.debug )
			{
				const paragraphs = [
					`Gain:${(this.gainNode.gain.value).toFixed(2)}`, 
					`Happiness:${(prediction.happiness).toFixed(3)}`, 
					`Smirks left:${(prediction.leftSmirk).toFixed(3)} / right:${(prediction.rightSmirk).toFixed(3)}`, 
					`mouthRange:${(prediction.mouthRange).toFixed(3)}`, 
					`mouthRatio:${(prediction.mouthRatio).toFixed(3)}`, 
					`mouthWidth:${(prediction.mouthWidth).toFixed(3)}`, 
					`mouthOpen:${(prediction.mouthOpen).toFixed(3)}`,
					`pitch:${(prediction.pitch).toFixed(3)} roll:${(prediction.roll).toFixed(3)} yaw:${(prediction.yaw).toFixed(3)}`,
					`eyes direction:${(prediction.eyeDirection).toFixed(3)} left:${(prediction.leftEye).toFixed(3)} right:${(prediction.rightEye).toFixed(3)}`,
					`eyes open :${this.areEyesOpen} left:${!prediction.leftEyeClosed} right:${!prediction.rightEyeClosed}`,
					`eye closed left:${prediction.leftEyeClosed} right:${prediction.rightEyeClosed}`,
					`dims:${(prediction.mouthWidth).toFixed(2)}x${(prediction.mouthRange).toFixed(2)}`,
					'facing'+prediction.lookingRight ? 'left' : 'right'
				]
				drawParagraph(prediction.boundingBox.topLeft[0], prediction.boundingBox.topLeft[1] + 40, paragraphs, '14px' )
				// drawText(prediction.boundingBox.topLeft[0], prediction.boundingBox.topLeft[1], extra )
			}
		}
	}

	/////////////////////////////////////////////////////////////////////
	// Sing some songs
	/////////////////////////////////////////////////////////////////////
	sing(){

		if (!this.data || this.tracks > MAX_TRACKS)
		{
			return {
				yaw:0, pitch:0, 
				lipPercentage:0,
				eyeDirection:0
			}
		}

		// only change the note if not active?
		if (active)
		{
			// return
		}

		const prediction = this.data
		const options = this.options

		// do some checks on data to see if an event
		// should be triggered such as eye left / right

		// we want to ignore the 0-5px range too as inconclusive!
		const lipPercentage = prediction.mouthOpen
		
		// Controls minor / major
		const yaw = prediction.yaw
		
		// Octave control by up and down head
		const pitchRaw = clamp(0.5 * (prediction.pitch + 1) * this.options.pitchSensitivity, 0, 1)
		// const pitch = (prediction.pitch + 1 ) / 2
		
		// -1 => +1 -> convert to 
		// ignore < -0.5 and > 0.5
		// we can exagerate a motion by amplyifying it's signal and clamping its output
		const rollRaw = clamp((prediction.roll + 0.5) * this.options.rollSensitivity, 0, 1)
		
		// swap em arounnd!
		const pitch = this.options.swapControls ? rollRaw : pitchRaw
		const roll = this.options.swapControls ? pitchRaw : rollRaw

		// Controls stereo pan
		const eyeDirection = clamp(prediction.eyeDirection , -1, 1 )  // (prediction.eyeDirection + 1)/ 2

		// volume is an log of this
		const amp = clamp(lipPercentage, 0, 1 ) //- 0.1
		const logAmp = options.ease(amp)
		const newOctave = Math.round(pitch * 7)

		// octave needs to be up or down from existing?
		this.octave = newOctave

		// FIXME: if we don't want the happy notes...
		// we can flip this on somehow?
		const isMinor = prediction.lookingRight

		// eg. A1 Ab1 C3 etc
		const noteName = getNoteName(roll, this.octave, isMinor)
		// eg. Do Re Mi
		const noteSound = getNoteSound(roll, isMinor)

		// cache for drawing getNoteText
		this.lastNoteName = noteName
		this.lastNoteSound = noteSound
		this.hue = roll * 360
		this.saturation = 100 * lipPercentage

		// console.log("Person", prediction.yaw , yaw)
		// // console.log("Person", {lipPercentage, yaw, pitch, amp, logAmp})

		this.stereoNode.pan.value = eyeDirection
		//this.stereoNode.pan.setValueAtTime(panControl.value, this.audioContext.currentTime);
		
		// you want the scale to be from 0-1 but from 03-1
		let newVolume

		// !active && active is updated by playback state
		if ( this.instrument && amp >= options.mouthCutOff )
		{
			// here is where we need to do our majic
			// play a note from the collectionlogAmp
			const note = this.instrument[ noteName ]

			if (!note){
				console.log("note not found!", {noteName, roll, octave:this.octave, isMinor})
			}
			
			// TODO: add velocity logAmp
			this.tracks++
			const track = playTrack( note, 0, this.stereoNode ).then( ()=>{
				this.active = false
				this.tracks--
				//console.log("Sample completed playback... request tock", this.tracks )
			})
			
			// rescale for 0.3->1
			newVolume = this.mouthScale( amp )
			// curve
			newVolume = options.ease(newVolume)
			// smooth
			newVolume = Math.round( newVolume * this.precision ) / this.precision 
			
			// newVolume = Math.round( newVolume * options.precision * 10 ) / (options.precision * 10) 
			// newVolume = parseFloat( newVolume.toFixed( options.precision)) 
			
			// send out some MIDI yum yum noteName && 
			// if (this.hasMIDI && !this.active)
			if (this.hasMIDI)
			{
				// duration: 2000,
				// https://github.com/djipco/webmidi/blob/develop/src/Output.js
				//console.log("MIDI",amp, noteNumber, INSTRUMENT_NAMES.length, noteName, this.midiChannel)
				const midiOptions = { 
					channels:this.midiChannel,
					attack:newVolume // amp
				}

				this.midi.playNote( noteName, midiOptions )
				
				if (this.midiActive)
				{
					this.midi.setKeyAftertouch(noteName, (eyeDirection + 1 ) * 0.5 )
					// this.midi.setPitchBend( eyeDirection )
				}else{
					this.midiActive = true
				}
				
				//console.log(t, "MIDI noteOn", noteName, "Channel:"+this.midiChannel, { midiOptions, channel:this.midiChannel, hasMIDI:this.hasMIDI} )
		
				// Use eye direction as a modifier for the sound
				if (eyeDirection !== 0)
				{
					// Midi pitch bending with eyes!
					// Pitch bending eyes!
					// 
					// this.midi.setKeyAftertouch(noteName, (eyeDirection + 1 ) * 0.5 )
				}
			}

			this.singing = true
			this.isMouthOpen = true
			this.active = true
			
		}else if ( amp > options.mouthSilence && amp < options.mouthCutOff ){

			// dampen the sound to silence
			// this.gainNode.gain.value = 0
			//const destinationVolume  = 0 // logAmp
			
			// newVolume = this.gainNode.gain.value + (destinationVolume - this.gainNode.gain.value) * options.volumeRate
			newVolume = 0
			this.singing = false
			this.isMouthOpen = true

		}else{

			// no instrument available or mouth totally closed
			newVolume = 0
			this.singing = false
			this.isMouthOpen = false
			// no instruments in memory yet... play silence?
		}

		//&& this.midiActive If the user has stopped singing we need to stop the midi too!
		if (this.hasMIDI)
		{
			this.midi.sendClock( )
			this.midi.setSongPosition( getBarProgress() * 16383 )
				
			if (!this.singing)
			{
				this.midi.stopNote(noteName, {
					// The velocity at which to release the note (between `0` * and `1`). If the `rawValue` option is `true`, the value should be specified as an integer
					// between `0` and `127`. An invalid velocity value will silently trigger the default of `0.5`.
					release:0.2
				})

				// immediate mute, but doesn't block (sounds better)
				this.midi.turnSoundOff()

				// fade out but prevents new notes...
				this.midi.turnNotesOff()
				
				// prevent flooding the off bus
				this.midiActive = false

				console.log(this.midi, "MIDI turnSoundOff", noteName, "Channel:"+this.midiChannel,{ channel:this.midiChannel, hasMIDI:this.hasMIDI, MIDIDeviceName:this.MIDIDeviceName} )
			}		
		}
		

// WebMidi.outputs[0].channels[1].stopNote("C3", {time: "+2500"});

// // Set polyphonic aftertouch : Send polyphonic aftertouch message to channel 8

// WebMidi.outputs[0].channels[8].setKeyAftertouch("B#3", 0.25);

// // Set pitch bend value : The value is between -1 and 1 (a value of 0 means no bend).

// WebMidi.outputs[0].channels[8].setPitchBend(-0.25);


// smooth this down
		// try and smooth the volume if it is fading out...
		// if ( this.gainNode.gain.value > newVolume)
		// {
		// 	// volume decrease fades
			//this.gainNode.gain.value = this.gainNode.gain.value + (newVolume - this.gainNode.gain.value) * options.volumeRate
		
		// }else{

		// 	this.gainNode.gain.value = this.gainNode.gain.value + (newVolume - this.gainNode.gain.value) * 0.9
		// 	// volume in direct
		// 	// this.gainNode.gain.value = newVolume
		// }
		// this.gainNode.gain.value = newVolume
		//console.log("Gain", this.gainNode.gain.value, "newVolume", newVolume, "Precision", this.precision )
		
		this.gainNode.gain.value = newVolume
		
		this.yaw = yaw
		this.pitch = pitch
		this.roll = roll

		return {
			yaw, pitch, roll,
			lipPercentage,
			eyeDirection
		}
	}

	/////////////////////////////////////////////////////////////////////
	//
	/////////////////////////////////////////////////////////////////////
	async loadRandomInstrument(callback){
		return await this.loadInstrument( randomInstrument(), callback )
	}

	/////////////////////////////////////////////////////////////////////
	//
	/////////////////////////////////////////////////////////////////////
	async loadPreviousInstrument(callback){
		const index = this.index
		const newIndex = index-1 < 0 ? 0 : index-1
		return await this.loadInstrument( INSTRUMENT_FOLDERS[newIndex], callback )
	}

	/////////////////////////////////////////////////////////////////////
	//
	/////////////////////////////////////////////////////////////////////
	async loadNextInstrument(callback){
		const index = this.index
		const newIndex = index+1 >= INSTRUMENT_FOLDERS.length ? 0 : index+1
		return await this.loadInstrument( INSTRUMENT_FOLDERS[newIndex], callback )
	}

	/////////////////////////////////////////////////////////////////////
	// we need loadiing events?
	/////////////////////////////////////////////////////////////////////
	async loadInstrument(instrumentName, callback){

		this.instrumentLoading = true
		this.instrument = await loadInstrument( instrumentName )
		this.index = INSTRUMENT_FOLDERS.indexOf(instrumentName)

		this.instrumentLoading = false
		
		console.log(this.index, "Attempting to load instruments", instrumentName, this.instrument )

		callback && callback( instrumentName )
		
		// you have to dispatch the event from an element!
		this.button.dispatchEvent(new CustomEvent("instrumentchange", {
			detail: { instrument:this.instrument, instrumentName }
		}))

		return instrumentName
	}

	/////////////////////////////////////////////////////////////////////
	//
	/////////////////////////////////////////////////////////////////////
	setMIDI(midi, channel="all"){
		this.midiChannel = channel
		this.midi = midi
		//console.log("MIDI set for person", this, "Channel:"+this.midiChannel, {midi,channel, hasMIDI:this.hasMIDI } )
	}

	/////////////////////////////////////////////////////////////////////
	// Instrument selected from the DOM UI face click
	/////////////////////////////////////////////////////////////////////
	onInstrumentInput(event) {
		const id = event.target.id
		//console.error(id, "on inputted", event)
		this.hideForm()
		this.loadInstrument(id)
		event.preventDefault()
	}

	onLeftEyeOpen( timeClosedFor ){
		this.leftEyeClosedAt = -1
	}
	onLeftEyeClose( timeClosed ){
		this.leftEyeClosedAt = timeClosed
	}

	onRightEyeOpen( timeClosedFor ){
		this.rightEyeClosedAt = -1
	}

	onRightEyeClose( timeClosed ){
		this.rightEyeClosedAt = timeClosed
	}



	/////////////////////////////////////////////////////////////////////
	// This pops up the user side bar and populates it accordingly
	/////////////////////////////////////////////////////////////////////
	showForm(){

		//console.log("showForm", this.controlsID, this.controls)

		this.controls.innerHTML = setupInstrumentForm( ()=> {})
		const inputs = this.controls.querySelectorAll('input')
		inputs.forEach( input => input.addEventListener('change', event => this.onInstrumentInput(event) ), false)
		
		// find active input field and focus
		const active = document.getElementById(this.instrumentName)
		if (active)
		{
			active.focus()
		}else{
			// send focus to form
			this.controls.focus()
		}
		this.controls.classList.toggle("showing",true)
	}

	/////////////////////////////////////////////////////////////////////
	//
	/////////////////////////////////////////////////////////////////////
	hideForm(){
		//const inputs = this.controls.querySelectorAll('input')
		//inputs.forEach( input => input.removeEventListener('change',  this.onInstrumentInput))
		this.controls.innerHTML = ''
		setTimeout( ()=> this.controls.classList.toggle("showing",false), 303 )
	}
}