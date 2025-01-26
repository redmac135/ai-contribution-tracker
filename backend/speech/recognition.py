import speech_recognition as sr

class Recognition:
    def __init__(self):
        self.r = sr.Recognizer()

    async def record(self, data, duration):
        # audio object                                                         
        audio = sr.AudioFile(data)
        #read audio object and transcribe
        with audio as source:
            audio = self.r.record(source)                  
            result = self.r.recognize_google(audio)