import React, { useEffect, useState } from 'react';
import './App.css';
import './checkButton.css';
import './micButton.css';
import { SpinningAnimation } from './components/SpinningAnimation';

function App() {

  const [recording, setRecording] = useState(false);
  const [media, setMedia] = useState<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [result, setResult] = useState<string>("");

  async function uploadAudio(blob: Blob) {
    const formData = new FormData();

    // Create a File with proper type information
    const file = new File([blob], "recording", {
      type: blob.type,  // This preserves the MIME type
      lastModified: Date.now()
    });

    formData.append('file', file);

    try {
      const response = await fetch(`https://ollama.ethanzhao.me/convert/`, {
        method: 'POST',
        body: formData
      });

      // For debugging
      console.log('Blob type:', blob.type);

      const serverResult = await response.json()
      console.log('Server response:', serverResult);

      console.info('Transcription:', serverResult.transcription);
      setResult(serverResult.transcription);

      return serverResult;
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }

  useEffect(() => {
    const setupMediaDevice = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const tmpMediaRecorder = new MediaRecorder(stream);
      tmpMediaRecorder.ondataavailable = function(e) {
        setMedia(media => [...media, e.data]);
      };
      tmpMediaRecorder.onstop = function() {
        const blob = new Blob(media, { type: tmpMediaRecorder.mimeType });
        uploadAudio(blob);
      };
      setMediaRecorder(tmpMediaRecorder);
    }

    setupMediaDevice();
  }, [media]);

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
        <div className="title">Start Tracking Participation</div>
        {recording && <label className="recordLabel" htmlFor="recordButton" ><SpinningAnimation /></label>}
        {!recording && <label className="micNotOn" htmlFor="recordButton">
          <img className="micButton" src="/voice.png" alt="" />
        </label>}
        <input className="checkButton" type='checkbox' id='recordButton' checked={recording} onChange={handleRecordingToggle} />
        <div className="rectangle">
          <div className="transcription">
            {result}
          </div>
        </div>
      </header>
    </div>

  );
}

export default App;
