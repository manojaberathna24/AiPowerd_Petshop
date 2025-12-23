"""
Create FAISS Vector Database from PDF Knowledge Base
Run this script to process PDF files and create the vector store
"""

import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_cohere import CohereEmbeddings
from langchain_community.vectorstores import FAISS

load_dotenv()

def create_vector_db():
    """Create FAISS vector database from PDF files."""
    
    cohere_api_key = os.getenv("COHERE_API_KEY")
    if not cohere_api_key:
        print("❌ COHERE_API_KEY not found in .env file")
        return
    
    # Check if data directory exists
    if not os.path.exists("data"):
        os.makedirs("data")
        print("📁 Created 'data' directory. Please add PDF files and run again.")
        
        # Create a sample pet care document
        sample_content = """
        # Pet Care Guide for MPS PetCare
        
        ## Dog Care Basics
        - Feed adult dogs twice daily with high-quality dog food
        - Ensure fresh water is always available
        - Regular exercise is essential - at least 30 minutes daily
        - Vaccinations: Rabies, Distemper, Parvovirus are essential
        - Regular grooming based on breed requirements
        
        ## Cat Care Basics
        - Feed cats 2-3 small meals daily
        - Keep litter box clean - scoop daily
        - Provide scratching posts to protect furniture
        - Vaccinations: Rabies, FVRCP are essential
        - Regular brushing helps reduce hairballs
        
        ## Pet Health Signs to Watch
        - Loss of appetite for more than 24 hours
        - Excessive thirst or urination
        - Lethargy or unusual behavior
        - Vomiting or diarrhea
        - Difficulty breathing
        
        If you notice these signs, consult a veterinarian immediately.
        
        ## Nutrition Tips
        - Avoid feeding pets chocolate, grapes, onions, and garlic
        - Human food should be limited
        - Age-appropriate food is important (puppy, adult, senior)
        - Treats should be less than 10% of daily calories
        
        ## Training Tips
        - Use positive reinforcement
        - Be consistent with commands
        - Start training early
        - Keep training sessions short (5-15 minutes)
        - Patience is key
        
        MPS PetCare offers a wide range of pet products, adoption services, 
        and can help you find veterinary services near you in Sri Lanka.
        """
        
        with open("data/pet_care_guide.txt", "w") as f:
            f.write(sample_content)
        print("📄 Created sample pet care guide in data folder")
    
    # Initialize embeddings
    embeddings = CohereEmbeddings(
        cohere_api_key=cohere_api_key,
        model="embed-english-v3.0"
    )
    
    documents = []
    
    # Load PDF files if any
    pdf_files = [f for f in os.listdir("data") if f.endswith(".pdf")]
    if pdf_files:
        print(f"📚 Loading {len(pdf_files)} PDF files...")
        loader = DirectoryLoader("data", glob="**/*.pdf", loader_cls=PyPDFLoader)
        documents.extend(loader.load())
    
    # Load text files
    txt_files = [f for f in os.listdir("data") if f.endswith(".txt")]
    if txt_files:
        print(f"📄 Loading {len(txt_files)} text files...")
        for txt_file in txt_files:
            with open(os.path.join("data", txt_file), "r", encoding="utf-8") as f:
                from langchain.schema import Document
                documents.append(Document(page_content=f.read(), metadata={"source": txt_file}))
    
    if not documents:
        print("❌ No documents found in 'data' directory")
        return
    
    print(f"📝 Processing {len(documents)} documents...")
    
    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    texts = text_splitter.split_documents(documents)
    print(f"✂️ Split into {len(texts)} chunks")
    
    # Create FAISS vectorstore
    print("🔄 Creating FAISS vectorstore...")
    vectorstore = FAISS.from_documents(texts, embeddings)
    
    # Save vectorstore
    vectorstore.save_local("vectorstore")
    print("✅ Vectorstore saved to 'vectorstore' directory")
    print("🎉 Vector database creation complete!")


if __name__ == "__main__":
    create_vector_db()
