"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/button";
import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/solid";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import styles from "./page.module.css";
import { error } from "console";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

type WaveformData = number[];

export default function RecordPage(): JSX.Element {
  const [recording, setRecording] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  // We'll use a ref to store the audio chunks.
  const audioChunksRef = useRef<Blob[]>([]);
  // Optionally, if you need to display the count, you can also have state:
  const [chunkCount, setChunkCount] = useState<number>(0);
  
  const [waveformData, setWaveformData] = useState<WaveformData>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [section, setSection] = useState<string | null>(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recording]);

  const updateWaveform = () => {
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      setWaveformData(Array.from(dataArrayRef.current));
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    }
  };

  const startRecording = async (): Promise<void> => {
    if (!section) setSection("Lecture 1");
    try {
      const audioStream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder: MediaRecorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm;codecs=opus",
      });

      setStream(audioStream);
      setMediaRecorder(recorder);
      // Clear the ref when starting a new recording.
      audioChunksRef.current = [];
      setChunkCount(0);
      setRecording(true);
      recorder.start();

      const audioContext: AudioContext = new AudioContext();
      const source: MediaStreamAudioSourceNode = audioContext.createMediaStreamSource(audioStream);
      const analyser: AnalyserNode = audioContext.createAnalyser();

      analyser.fftSize = 128;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      updateWaveform();

      recorder.ondataavailable = (e: BlobEvent) => {
        // Push new data into the ref.
        audioChunksRef.current.push(e.data);
        // Optionally update state for UI display.
        setChunkCount(audioChunksRef.current.length);
      };
      recorder.onstop = async () => {
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        await uploadAudio();
      };
    } catch (err) {
      console.error("Error recording audio:", err);
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      stream?.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
    setTime(0);
  };

  async function uploadAudio() {
    const formData = new FormData();

    // Log the current audio chunks from the ref.
    console.log("Audio chunks count:", audioChunksRef.current.length);

    const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder?.mimeType });
    // Create a File with proper type information
    const file = new File([audioBlob], "recording", {
      type: audioBlob.type, // This preserves the MIME type
      lastModified: Date.now(),
    });``

    formData.append("file", file);
    formData.append("sectionName", section!);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}recognition/convert/`, {
        method: "POST",
        body: formData,
      });

      const serverResult = await response.json();
      console.log("Server response:", serverResult);
      console.info("Transcription:", serverResult.transcription);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    // Clear the ref after uploading.
    audioChunksRef.current = [];
    setChunkCount(0);
  }

  const sections = ["Lecture 1", "Lecture 2", "Lecture 3"];
  const selectSection = (section: string) => {
    setSection(section);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container}>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">{section ?? "Select A Section"}</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            {sections.map((section, index) => (
              <DropdownItem key={index} onPress={() => selectSection(section)}>
                {section}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className={styles.container}>
        <Button
          className={styles.recordButton}
          onPress={recording ? stopRecording : startRecording}
        >
          {recording ? (
            <StopIcon className={styles.icon} />
          ) : (
            <MicrophoneIcon className={styles.icon} />
          )}
        </Button>
      </div>
      <div className={styles.chartContainer}>
        {recording && <p className={styles.timer}>Recording: {time}s</p>}
        {recording && (
          <Line
            data={{
              labels: Array(waveformData.length).fill(""),
              datasets: [
                {
                  data: waveformData,
                  borderColor: "#3b82f6",
                  borderWidth: 2,
                  tension: 0.2,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: { x: { display: false }, y: { display: false } },
              elements: { point: { radius: 0 } },
            }}
          />
        )}
      </div>
    </div>
  );
}
