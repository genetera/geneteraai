from .base import BaseAI

from langchain.vectorstores.pinecone import Pinecone
from langchain.llms.openai import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

from .templates import content_creation_template, content_editing_template


class ContentGenerator(BaseAI):
    def get_prompt(self, platform: str, category: str, emotion: str) -> PromptTemplate:
        return content_creation_template(platform, category, emotion)

    def get_content_editing_prompt(self) -> PromptTemplate:
        return content_editing_template()

    def generate_content(self, prompt, question, namespace) -> str:
        # Initialize pinecone
        self.initialize_pinecone()

        MODEL_NAME = "gpt-3.5-turbo"

        embeddings = OpenAIEmbeddings(openai_api_key=self.OPEN_AI_API_KEY)
        INDEX_NAME = "genetera"
        llm = ChatOpenAI(openai_api_key=self.OPEN_AI_API_KEY, model_name=MODEL_NAME)
        llm_chain = LLMChain(prompt=prompt, llm=llm)
        doc_search = Pinecone.from_existing_index(INDEX_NAME, embeddings)
        docs = doc_search.similarity_search(question, namespace=namespace, k=3)
        docs = [doc.page_content for doc in docs]
        answer = llm_chain.run({"context": "\n".join(docs), "question": question})
        return answer
