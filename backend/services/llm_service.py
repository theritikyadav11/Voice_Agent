from google import genai
from google.genai import types

class LLMService:
    def __init__(self):
        self.client = genai.Client()
        self.model = "gemini-2.5-flash"

    def generate_content(self, prompt, temperature=0.7, max_tokens=1024):
        llm_response = self.client.models.generate_content(
            model=self.model,
            contents=[prompt],
            config=types.GenerateContentConfig(
                temperature=temperature,
                max_output_tokens=max_tokens
            )
        )
        return (llm_response.text or "").strip()
 