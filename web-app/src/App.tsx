import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { SpinningAnimation } from "./components/SpinningAnimation";
import { useReactMediaRecorder } from "react-media-recorder";

function App() {
  const [recording, setRecording] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  const audioRef = useRef<HTMLAudioElement>(null);

  async function uploadAudio() {
    const responseBlob = await fetch(mediaBlobUrl as string);
    const blob = await responseBlob.blob();

    const formData = new FormData();
    formData.append("url", mediaBlobUrl as string);

    return await fetch(`${process.env.REACT_APP_BACKEND_URL}/speech/convert`, {
      method: "POST",
      body: formData,
    });
  }

  useEffect(() => {
    if (mediaBlobUrl) {
      audioRef.current!.src = mediaBlobUrl;
    }
  }, [mediaBlobUrl]);

  async function handleRecordingToggle() {
    // note: this value is reversed as handle change gets called before bind is called.
    if (recording) {
      stopRecording();
      setRecording(false);
      await uploadAudio();
    } else {
      startRecording();
      setRecording(true);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <label className="recordLabel" htmlFor="recordButton">
          fdjsghakaghsdkjf
        </label>
        <input
          type="checkbox"
          id="recordButton"
          checked={recording}
          onChange={handleRecordingToggle}
        />
        <audio ref={audioRef} controls />
      </header>
    </div>
  );
}

export default App;
