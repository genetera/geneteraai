import pinecone


class BaseAI:
    def __init__(self, open_ai_api_key: str, pinecone_api_key: str, pinecone_env: str):
        self.OPEN_AI_API_KEY = open_ai_api_key
        self.PINECONE_API_KEY = pinecone_api_key
        self.PINECONE_ENV = pinecone_env

    def initialize_pinecone(self):
        return pinecone.init(
            api_key=self.PINECONE_API_KEY, environment=self.PINECONE_ENV
        )
