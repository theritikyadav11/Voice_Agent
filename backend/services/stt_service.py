import assemblyai as aai
from fastapi.concurrency import run_in_threadpool

class STTService:
    def __init__(self, api_key):
        aai.settings.api_key = api_key
        self.transcriber = aai.Transcriber()
        self.config = aai.TranscriptionConfig(speech_model=aai.SpeechModel.slam_1)

    async def transcribe(self, file_path):
        transcript = await run_in_threadpool(self.transcriber.transcribe, file_path, config=self.config)
        return transcript.text.strip() if transcript and transcript.text else ""
