import pinecone
from typing import List

from .base import BaseAI

from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores.pinecone import Pinecone


class DocManager(BaseAI):
    def load_document_and_split(self, document):
        """
        Load document content and split.

        Args:
            document (Document): A document to load and split.

        Returns:
            document chunks.
        """
        loaded_document_chunks = PyPDFLoader(document).load_and_split()
        return loaded_document_chunks

    def load_embeddings_to_db(
        self, ids: List[str], chunk_texts: List[str], index_name: str, namespace: str
    ):
        """
        Generates Embeddings and save them to vector DB.

        Args:
            document_text (str): Text to split into smaller chunks.

        Returns:
            (List): List of chunked texts.
        """
        self.initialize_pinecone()

        PINECONE_INDEX_NAME = index_name

        if PINECONE_INDEX_NAME not in pinecone.list_indexes():
            # we create a new index
            pinecone.create_index(
                name=index_name,
                metric="cosine",
                dimension=1536,  # 1536 dim of text-embedding-ada-002
            )

        model_name = "text-embedding-ada-002"

        embed = OpenAIEmbeddings(model=model_name, openai_api_key=self.OPEN_AI_API_KEY)
        return Pinecone.from_documents(
            documents=chunk_texts,
            index_name=PINECONE_INDEX_NAME,
            embedding=embed,
            ids=ids,
            namespace=namespace,
        )

    def delete_by_namespace(self, index_name: str, namespace: str) -> None:
        """
        Delete vectors from DB based on passed namespace.

        Args:
            index_name (str): Index to look in.
            namespace (str): namespace to delete vectors from.

        Returns:
            (None): .
        """
        self.initialize_pinecone()

        PINECONE_INDEX_NAME = index_name

        return Pinecone(index=PINECONE_INDEX_NAME).delete(
            delete_all=True, namespace=namespace
        )

    def delete_by_document_ids(
        self, index_name: str, document_ids: List[str], namespace: str
    ) -> None:
        """
        Delete document vectors from DB based on passed document ids.

        Args:
            index_name (str): Index to look in.
            document_ids (List[str]): document ids to delete vectors belongs to.
            namespace (str): namespace name.

        Returns:
            (None): .
        """
        self.initialize_pinecone()

        PINECONE_INDEX_NAME = index_name
        index = pinecone.Index(PINECONE_INDEX_NAME)

        return index.delete(ids=document_ids, namespace=namespace)
