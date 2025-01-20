import speech_recognition as sr

r = sr.Recognizer()

with sr.Microphone() as source:
    print("Recognizing...")
    audio_data = r.record(source, duration=5)
    text = r.recognize_google(audio_data)
    print(text)