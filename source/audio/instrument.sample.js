import Instrument from './instrument'
// A generic interface for instruments
import {
	instrumentFolders
} from './instruments'
import { 
	playTrack,loadInstrumentPack,
	loadInstrument, randomInstrument, 
	NOTE_NAMES,	getNoteName } from './audio'

import {MIDI_CONVERTOR, noteNameToNoteNumber} from './notes'

// Maximum simultaneous tracks to play (will wait for slot)
const MAX_TRACKS = 18
export default class SampleInstrument extends Instrument{

	instrument
	instrumentName = "Unloaded"
	instrumentPack
	instrumentNumber
	instrumentPointer = 0
	instrumentLoading = true
	
	// allow this itself to load instruments from the system
	// based on whatever programNumber we set below...
	constructor( audioContext, destinationNode, options={} ){
		super(audioContext, destinationNode, options)
		// we add a few extra sample places for the instruments
		this.polyphony = 5
		
		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 1
		this.gainNode.connect(destinationNode)
	}

	getVolume(){
		return this.gainNode.gain.value
	}

	setVolume( volume ){
		this.gainNode.gain.value = volume
	}

	// Like note on but a little easier!
	async noteOnByName(noteName, velocity=1, noteNumber=-1 ){
		
		// too many simultaneous samples
		if ( ++this.polyphony > MAX_TRACKS){

		}

		if (this.active){
			//console.log("Sample overwriting playback.", noteName )
		}

		this.active = true
		this.setVolume( velocity )

		const audioBuffer = this.instrument[noteName]
		
		// FIXME: Add to active so we can remove it later
		const track = playTrack( audioBuffer, 0, this.gainNode ).then( ()=>{
			this.polyphony--
			//console.log("Sample completed playback.", track )
			return true
		})

		return super.noteOn(noteNumber > 0 ? noteNumber : noteNameToNoteNumber(noteName), velocity)
	}

	async noteOn(noteNumber, velocity=1){
		const noteName = MIDI_CONVERTOR[noteNumber]
		return this.noteOnByName( noteName , velocity, noteNumber )
	}

	// FIXME: Fade out the gate
	async noteOff(noteNumber, velocity=0){
		this.setVolume( velocity )
		return super.noteOff(noteNumber)
	}

	aftertouch( noteNumber, pressure ){
		super.aftertouch( noteNumber, pressure )
	}
	
	pitchBend(pitch){
		super.pitchBend(pitch)
	}

	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		super.programChange( programNumber )
		return await this.loadInstrument( instrumentFolders[programNumber] )
	}


	// INTERNAL -------------------------------------------
	
	/**
	 * Provide this Person with a random instrument
	 * @param {Function} callback Method to call once the instrument has loaded
	 */
	 async loadRandomInstrument(callback){
		return await this.loadInstrument( randomInstrument(), callback )
	}

	/**
	 * Load the previous instrument in the list
	 * @param {Function} callback Method to call once the instrument has loaded
	 */
	async loadPreviousInstrument(callback){
		const index = this.instrumentPointer-1
		const newIndex = index < 0 ? instrumentFolders.length + index : index
		return await this.loadInstrument( instrumentFolders[newIndex], callback )
	}

	/**
	 * Load the subsequent instrument in the list
	 * @param {Function} callback Method to call once the instrument has loaded
	 */
	async loadNextInstrument(callback){
		const index = this.instrumentPointer+1 
		const newIndex = index >= instrumentFolders.length ? 0 : index
		return await this.loadInstrument( instrumentFolders[newIndex], callback )
	}

	/**
	 * Reload ALL instruments for this user
	 * NB. If we have swapped the instrument pack we can use this method
	 * to reload the same instrument but with the new samples
	 * @param {Function} callback Method to call once the instrument has loaded
	 */
	async reloadInstrument(callback){
		return await this.loadInstrument( instrumentFolders[this.instrumentPointer], callback )
	}

	/**
	 * Load a specific instrument for this Person
	 * TODO: Add loading events
	 * @param {String} instrumentName Name of the standard instrument to load
	 * @param {String} instrumentPack Name of the standard instrument to load
	 * @param {Function} callback Method to call once the instrument has loaded
	 */
	 async loadInstrument(instrumentName, instrumentPack, progressCallback ){
		this.instrumentLoading = true
		this.instrument = await loadInstrumentPack( instrumentName, instrumentPack, progressCallback )
		this.instrumentName = instrumentName
		this.instrumentPack = instrumentPack
		this.instrumentNumber = instrumentFolders.indexOf(instrumentName)
		this.instrumentMap = {}
		// TODO: inside out object
		// convert the instrument map into a number map
		for (let i=0; i < 200; ++i){
			this.instrumentMap[i] = this.instrument
		}
		this.instrumentLoading = false
		// this.instrumentOrder = this.instrument
		return this.instrument
	}
}
