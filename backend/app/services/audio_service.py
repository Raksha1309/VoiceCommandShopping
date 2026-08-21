import speech_recognition as sr
import io
import os
import wave
from pydub import AudioSegment

class AudioService:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    def transcribe_audio(self, audio_bytes: bytes, filename: str) -> str:
        """
        Transcribes the raw audio bytes into text using Google's free web API.
        """
        try:
            # We first need to convert the incoming WebM or MP3 audio from the browser into WAV
            # Since browsers usually send webm, we use pydub to convert it
            
            # Save temporary file
            temp_input = f"temp_input_{filename}"
            temp_wav = f"temp_output_{filename}.wav"
            
            with open(temp_input, "wb") as f:
                f.write(audio_bytes)
                
            try:
                # Convert to wav
                audio = AudioSegment.from_file(temp_input)
                audio.export(temp_wav, format="wav")
                
                # Now use SpeechRecognition
                with sr.AudioFile(temp_wav) as source:
                    audio_data = self.recognizer.record(source)
                    
                # Use Google's free web API
                text = self.recognizer.recognize_google(audio_data)
                return text
                
            finally:
                # Clean up temporary files
                if os.path.exists(temp_input):
                    os.remove(temp_input)
                if os.path.exists(temp_wav):
                    os.remove(temp_wav)
                    
        except sr.UnknownValueError:
            return "" # Could not understand the audio
        except sr.RequestError as e:
            print(f"Could not request results from Google Speech Recognition service; {e}")
            return ""
        except Exception as e:
            print(f"Error processing audio: {e}")
            return ""

audio_service = AudioService()
