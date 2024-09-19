import { fetchPermissions, PERMISSION_GRANTED, PERMISSION_PROMPT } from "../capabilities"

/**
 * Update the table of compatability and reveal it
 * if the user has a device that will not work 100%
 * then show a FATAL error message
 */
export const updateCapabalitiesTable = async (capabilities) => {
	
	const table = document.getElementById("compatability")
	
	const updateTable = (permissions) => {

		const CHECKING = "checking"
		const RESULT = "result"
		const NOT_AVAILABLE = "not-available"
		const AVAILABLE = "available"

		let fatal = false
		// remove .not-available as appropriate
	
		// TODO: show holographic stuff too
		const tableCamera = document.querySelector(".capability-camera")
			
		if (
			tableCamera &&
			( permissions.camera === PERMISSION_GRANTED || 
			permissions.camera === PERMISSION_PROMPT || 
			capabilities.cameraAvailable )
		){
			const cameraAvailability = tableCamera.querySelector("td."+RESULT)
			cameraAvailability.textContent = "Available"
			cameraAvailability.classList.remove(NOT_AVAILABLE)
			cameraAvailability.classList.remove(CHECKING)
			cameraAvailability.classList.add(AVAILABLE)
		}else{
			// FATAL ERROR! No camera!
			fatal = true
			body.classList.toggle("camera-unavailable", true)
			console.warn("[FATAL] No camera available")
		}	
	
		// Web MIDI!
		const tableMIDI = document.querySelector(".capability-midi")
		if (tableMIDI && capabilities.webMIDIAvailable)
		{
			const MIDIAvailability = tableMIDI.querySelector( "td."+RESULT )
			MIDIAvailability.textContent = "Available"
			MIDIAvailability.classList.remove(NOT_AVAILABLE)
			MIDIAvailability.classList.remove(CHECKING)
			MIDIAvailability.classList.add(AVAILABLE)
			
		}else{
			// NONE FATAL ERROR! No MIDI - just hide MIDI stuff!!
			body.classList.toggle("midi-unavailable", true)
			console.info("[WARNING] MIDI is not available")
		}	
	
		// GPU  
		const tableGPU = document.querySelector(".capability-gpu")
		if (tableGPU && (capabilities.webGL || capabilities.webGPU))
		{
			const GPUAvailability = tableGPU.querySelector("td."+RESULT )
			GPUAvailability.textContent = "Available"
			GPUAvailability.classList.remove(NOT_AVAILABLE)
			GPUAvailability.classList.remove(CHECKING)
		}else{
			// NONE FATAL ERROR! No WEBGL so use canvas fallback
			body.classList.toggle("gpu-unavailable", true)
			console.info("[WARNING] No GPU available")
		}	

		const tableSpeakers = document.querySelector(".capability-speakers")
		if (tableSpeakers && (capabilities.webGL || capabilities.webGPU))
		{
			const speakersAvailability = tableSpeakers.querySelector("td."+RESULT )
			speakersAvailability.textContent = "Available"
			speakersAvailability.classList.remove(NOT_AVAILABLE)
			speakersAvailability.classList.remove(CHECKING)
		}else{
			// NONE FATAL ERROR! No WEBGL so use canvas fallback
			body.classList.toggle("speakers-unavailable", true)
			console.info("[WARNING] No GPU available")
		}	

		// Speakers class="capability-speakers"
		return fatal
	}
	
	const permissions = await fetchPermissions()
	const isFatalIssue = updateTable(permissions)
	
	// FIXME: should we request the camera if permission was already granted?
	// what is going on?
	const devices = await navigator.mediaDevices.enumerateDevices()
	if (devices.length === 0)
	{
		// FATAL ERROR! No camera!

	}else{
		updateTable(devices)
	}
		
	console.log("Compatability table", table )
	console.log("Devices", {devices}) 
	console.log("Permissions", {isFatalIssue, permissions, capabilities}) 
	return isFatalIssue
}
