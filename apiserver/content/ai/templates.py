from ..utils import empty
from langchain.prompts import PromptTemplate


def content_creation_template(
    platform: str, category: str, emotion: str
) -> PromptTemplate:
    prompt = """
                You are an expert in content creation and you will create content taking into account
                context that you will find enclosed in backtics (```).

                Put each paragraph in html paragraph tag (<p>), put bolded text in html strong tag (<strong) 
                and make sure to turn single tag in self closing tag, for example <br> to <br />.
                but don't put it in html tag or body.
        """

    pre = "Here is some informations. The content you will create will be \n"
    lizt = ""

    if not (platform == "" or platform == "Other"):
        lizt += "Posted on " + platform + "," + " or is for " + platform + ".\n"

    if not (category == "" or category == "Other"):
        lizt += "About " + category + "," + " or is for " + category + ".\n"

    if not (emotion == "" or emotion == "Other"):
        lizt += emotion + " emotionally,\n"

    if not empty(lizt):
        prompt += pre + lizt

    prompt += """
                ```{context}```

                Initial prompt:
                {question}

                Answer:
        """

    return PromptTemplate(template=prompt, input_variables=["context", "question"])


def content_editing_template() -> PromptTemplate:
    prompt = """
                You are an expert in content creation, edit previous generated content that is provided 
                taking into account context that you will find enclosed in backtics (```).

                Put each paragraph in html paragraph tag (<p>), put bolded text in html strong tag (<strong) 
                and make sure to turn single tag in self closing tag, for example <br> to <br />.
                but don't put it in html tag or body.

                
                ```{context}```

                Previous content:
                {content}

                Initial prompt:
                {prompt}

                Answer:
        """

    return PromptTemplate(
        template=prompt, input_variables=["context", "content", "prompt"]
    )
