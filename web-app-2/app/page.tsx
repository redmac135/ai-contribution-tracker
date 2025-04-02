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
import styles from "./page.module.css";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

type WaveformData = number[];

export default function RecordPage(): JSX.Element {
  const [recording, setRecording] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [waveformData, setWaveformData] = useState<WaveformData>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
      if (dataArrayRef.current) {
        setWaveformData(Array.from(dataArrayRef.current));
      }
      console.log(dataArrayRef.current);
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    }
  };

  const startRecording = async (): Promise<void> => {
    try {
      const audioStream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder: MediaRecorder = new MediaRecorder(audioStream);
      setStream(audioStream);
      setMediaRecorder(recorder);
      setAudioChunks([]);
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

      recorder.ondataavailable = (e: BlobEvent) => setAudioChunks((chunks) => [...chunks, e.data]);
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
    audioContextRef.current?.close();

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return (
    <div className={styles.container}>
      <Button onPress={recording ? stopRecording : startRecording} className={styles.recordButton}>
        {recording ? <StopIcon className={styles.icon} /> : <MicrophoneIcon className={styles.icon} />}
      </Button>
      {recording && <p className={styles.timer}>Recording: {time}s</p>}
      {recording && (
        <div className={styles.chartContainer}>
          <Line
            data={{
              labels: Array(waveformData.length).fill(""),
              datasets: [{ data: waveformData, borderColor: "#3b82f6", borderWidth: 2, tension: 0.2 }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: { x: { display: false }, y: { display: false } },
              elements: { point: { radius: 0 } },
            }}
          />
        </div>
      )}
    </div>
  );
}
