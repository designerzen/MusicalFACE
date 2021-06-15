// const cam = (video) => {

// 	video = video || document.createElement('video')

// 	const stream = await navigator.mediaDevices.getUserMedia({
// 	  audio: false,
// 	  video: {
// 		facingMode: 'user',
// 		width: 640,
// 		height: 640
// 	  }
// 	})

// 	video.srcObject = stream
// }

// export const hasCameraCapabilities = () => {

// }
export const filterVideoCameras = (devices) => {
	
	return devices.filter( device => {
		// console.log("filterVideoCameras", device.kind, device.kind === "videoinput" , device)
		return device.kind === "videoinput"
		
	})
}

// WARNING : Triggers an error if not from a user click!?
// This returns a list of IDS that you can then feed into the setupCamera
// if you want to select a specific camera
export const detectCameras = async () => {
	return navigator.mediaDevices.enumerateDevices()
}

export const setupCamera = async (video, deviceId ) => {

	return new Promise( async (resolve,reject) => {
		
		let stream
		video = video ?? document.createElement('video')

		// stop it if it is already running?
		//video.stop()

		video.onloadedmetadata = (event) => { 
			
			// if not from a user document interaction, this
			// will throw some blah blah error so we must wrap and re-act
			try{
				video.play()
				video.width = video.videoWidth
				video.height = video.videoHeight
				resolve(stream)	
			}catch(error){
				reject(stream)
			}
			
		}

		video.onerror = event => {
			console.error("VIDEO:Error", event)
			reject(stream)
		}
		
		const videoConstraints = {}
		if (deviceId) {
		  videoConstraints.deviceId = { exact: deviceId }
		} else {
		  videoConstraints.facingMode = 'user' // 'environment'
		}

		const constraints = {
		  video: videoConstraints,
		  audio: false
		}

		try{
			// hope and preay that this is the right camera...
			stream = await navigator.mediaDevices.getUserMedia( constraints )
			
			video.srcObject = stream
			
		}catch(error){
			// console.error("stream",{constraints,stream,video})
	
			reject(error)
		}
	})
}
