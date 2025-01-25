import speech_recognition as sr

class Recognition:
    def __init__(self):
        self.r = sr.Recognizer()

    def record(self):
        with sr.Microphone() as source:
            print("Recognizing...")
            audio_data = self.r.record(source, duration=5)
            text = self.r.recognize_google(audio_data)
            print(text)
            return text