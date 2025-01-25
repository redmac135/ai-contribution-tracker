import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { SpinningAnimation } from './components/SpinningAnimation';

function App() {

  const [recording, setRecording] = useState(false);
  const [media, setMedia] = useState<Blob[]>([]);
  const[mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();

  async function uploadAudio(blob: Blob) {
		const formData = new FormData();
		formData.append('audio', blob);
		// Tmp user id
		formData.append('useruid', '1');
		return await fetch(`${process.env.REACT_APP_BACKEND_URL}entries/create/`, {
			method: 'POST',
			body: formData
		})
	}

	useEffect(() => {
		const setupMediaDevice = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const tmpMediaRecorder = new MediaRecorder(stream);
		  tmpMediaRecorder.ondataavailable = function (e) {
        setMedia(media => [...media, e.data]);
		  };
		  tmpMediaRecorder.onstop = function () {
		  	const blob = new Blob(media, { type: 'audio/ogg' });
		  	uploadAudio(blob);
		  };
		  setMediaRecorder(tmpMediaRecorder);
    }

    setupMediaDevice();
	}, []);

  function startRecording() {
    console.log('started recording');
    (mediaRecorder as MediaRecorder).start();
  }
  function stopRecording() {
		console.log('stopped recording');
		(mediaRecorder as MediaRecorder).stop();
	}
  function handleRecordingToggle() {
		// note: this value is reversed as handle change gets called before bind is called.
    if (recording) {
      stopRecording();
      setRecording(false);
		} else {
      startRecording();
      setRecording(true);
		}
  }


  return (
    <div className="App">
      <header className="App-header">

        <label className="recordLabel" htmlFor="recordButton">fdjsghakaghsdkjf</label>
        <input type='checkbox' id='recordButton' checked={recording} onChange={handleRecordingToggle} />

        <SpinningAnimation/>
      </header>
    </div>

  );
}

export default App;
