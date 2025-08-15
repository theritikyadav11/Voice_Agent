import httpx

class TTSService:
    def __init__(self, murf_api_key):
        self.headers = {"api-key": murf_api_key, "Content-Type": "application/json"}
        self.endpoint = "https://api.murf.ai/v1/speech/generate"

    async def tts(self, text, voice_id="en-US-natalie"):
        payload = {"text": text, "voiceId": voice_id}
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(self.endpoint, headers=self.headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data.get("audioFile", "/static/tts_fallback.wav")
