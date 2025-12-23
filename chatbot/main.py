"""
MPS PetCare AI Chatbot - Professional RAG-Based Assistant
Built with FastAPI and OpenRouter API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import httpx
import json
import re

load_dotenv()

app = FastAPI(title="MPS PetCare AI Chatbot", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "meta-llama/llama-3.2-3b-instruct:free"
BACKEND_URL = "http://localhost:5000"

print(f"🤖 Using model: {MODEL}")
print(f"🔑 OpenRouter API Key: {'✅ Found' if OPENROUTER_API_KEY else '❌ Not found'}")


class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = []
    products: Optional[List[dict]] = []
    knowledgeUsed: Optional[bool] = False


SYSTEM_PROMPT = """You are a professional pet care assistant for MPS PetCare in Sri Lanka.

SHOP INFORMATION:
- Name: MPS PetCare  
- Location: 123 Pet Street, Colombo, Sri Lanka
- Contact: +94 11 234 5678, hello@mpspetcare.lk
- Services: Pet supplies, pet adoption, grooming, veterinary, pet food delivery
- We have: Dogs, cats, birds, fish, small animals

YOUR ROLE:
Answer questions about pet care, health, shop services, and help customers.

CRITICAL RULES:
- Answer DIRECTLY and CONCISELY (2-3 sentences maximum)
- Do NOT show products unless user explicitly says "BUY", "PURCHASE", or "SHOP FOR"
- If asked ABOUT products/food/items → Answer with text description
- If user wants to BUY → Say "SEARCH_PRODUCTS"

Examples:
User: "Tell me about your shop" → "MPS PetCare is a premium pet store at 123 Pet Street, Colombo. We offer supplies, adoption, grooming, and vet services for all pets."
User: "What food do you have?" → "We stock Pedigree, Royal Canin, Drools for dogs; Whiskas, Royal Canin for cats; and special diets for other pets."
User: "I want to buy dog food" → "SEARCH_PRODUCTS"
"""


async def search_knowledge_base(query):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{BACKEND_URL}/api/knowledge/search",
                params={"query": query}
            )
            if response.status_code == 200:
                return response.json()
    except:
        pass
    return []


@app.get("/")
async def root():
    return {
        "message": "🐾 MPS PetCare AI Chatbot API",
        "status": "running",
        "model": MODEL
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}



@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not OPENROUTER_API_KEY:
        return ChatResponse(
            response="API key not configured.",
            sources=[], products=[], knowledgeUsed=False
        )
    
    try:
        user_message = request.message.lower()
        knowledge_results = await search_knowledge_base(request.message)
        knowledge_used = bool(knowledge_results)
        sources = []
        
        # Build context from knowledge base
        context_info = ""
        if knowledge_results:
            context_parts = [f"Q: {kb['question']}\\nA: {kb['answer']}" 
                           for kb in knowledge_results[:2]]
            context_info = "KNOWLEDGE:\\n" + "\\n\\n".join(context_parts)
            sources = [kb['title'] for kb in knowledge_results[:2]]
        
        # Build messages
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        if context_info:
            messages.append({
                "role": "system",
                "content": f"Use this information:\\n{context_info}"
            })
        
        if request.history:
            for msg in request.history[-6:]:
                role = "user" if msg.role == "human" else "assistant"
                messages.append({"role": role, "content": msg.content})
        
        messages.append({"role": "user", "content": request.message})
        
        # Call OpenRouter
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "MPS PetCare"
                },
                json={
                    "model": MODEL,
                    "messages": messages,
                    "max_tokens": 300,
                    "temperature": 0.7
                }
            )
            
            if response.status_code != 200:
                return ChatResponse(
                    response="I'm having trouble right now. Please try again!",
                    sources=[], products=[], knowledgeUsed=False
                )
            
            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]
            
            # ONLY show products if user wants to BUY
            explicit_buy = any(word in user_message for word in 
                             ['buy', 'purchase', 'shop for', 'order'])
            
            if "SEARCH_PRODUCTS" in ai_response or explicit_buy:
                products = []
                search_params = {}
                
                if 'dog' in user_message:
                    search_params['petType'] = 'dog'
                elif 'cat' in user_message:
                    search_params['petType'] = 'cat'
                
                if 'food' in user_message:
                    search_params['category'] = 'food'
                
                # Fetch products
                try:
                    async with httpx.AsyncClient(timeout=10.0) as api_client:
                        prod_response = await api_client.get(
                            f"{BACKEND_URL}/api/products",
                            params=search_params
                        )
                        if prod_response.status_code == 200:
                            products = prod_response.json()[:6]
                except:
                    pass
                
                if products:
                    names = ", ".join([p['name'] for p in products[:3]])
                    response_text = f"Here are some products for you:\\n{names}"
                    if len(products) > 3:
                        response_text += f", and {len(products)-3} more!"
                    
                    return ChatResponse(
                        response=response_text,
                        sources=sources,
                        products=products,
                        knowledgeUsed=knowledge_used
                    )
            
            # Return answer WITHOUT products
            return ChatResponse(
                response=ai_response,
                sources=sources,
                products=[],
                knowledgeUsed=knowledge_used
            )
    
    except Exception as e:
        print(f"Chat error: {e}")
        return ChatResponse(
            response="Sorry, I encountered an error. Please try again!",
            sources=[], products=[], knowledgeUsed=False
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
