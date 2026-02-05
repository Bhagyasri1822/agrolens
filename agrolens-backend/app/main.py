from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
import uuid
from datetime import datetime
import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import json
import requests
from groq import Groq
from PIL import Image
import io
import base64
from dotenv import load_dotenv

# Initialize FastAPI app
app = FastAPI(title="AI Soil Analysis API")
load_dotenv()

app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Security
security = HTTPBearer()

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = "soil_analysis_db"

# Groq API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY)

# Pydantic Models
class Location(BaseModel):
    lat: Optional[float] = None
    long: Optional[float] = None

class SoilAnalysisRequest(BaseModel):
    soil_image: str  # base64 encoded image
    lat: Optional[float] = None
    long: Optional[float] = None

class UserMessage(BaseModel):
    user_message: str
    soil_image: Optional[str] = None
    lat: Optional[float] = None
    long: Optional[float] = None

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserHistory(BaseModel):
    searchedImg: str
    lat: Optional[str] = None
    long: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AIResponseSchema(BaseModel):
    user_id: str
    chatHistory: List[dict] = []

# MongoDB Connection
class Database:
    def __init__(self):
        self.client = None
        self.db = None
    
    async def connect(self):
        self.client = AsyncIOMotorClient(MONGODB_URL)
        self.db = self.client[DATABASE_NAME]
        print("Connected to MongoDB")
    
    async def close(self):
        self.client.close()
        print("Disconnected from MongoDB")

db_client = Database()

# Dependency to get database
async def get_database():
    return db_client.db

# User authentication and utilities
class UserManager:
    @staticmethod
    async def create_user(db, user_data: UserCreate):
        # Check if user exists
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        user_id = str(uuid.uuid4())
        user = {
            "_id": user_id,
            "username": user_data.username,
            "email": user_data.email,
            "password": user_data.password,  # In production, hash this password!
            "history": [],
            "created_at": datetime.utcnow()
        }
        
        await db.users.insert_one(user)
        return {"user_id": user_id, "message": "User created successfully"}
    
    @staticmethod
    async def authenticate_user(db, email: str, password: str):
        user = await db.users.find_one({"email": email, "password": password})
        if not user:
            return None
        return user
    
    @staticmethod
    async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db = Depends(get_database)
    ):
        # In production, implement proper JWT token validation
        # For simplicity, we'll use the token as user_id
        user_id = credentials.credentials
        user = await db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        return user

user_manager = UserManager()

# AI Service for soil analysis
class AIService:
    @staticmethod
    async def analyze_soil(image_data: str, lat: Optional[float] = None, long: Optional[float] = None):
        """Analyze soil using Groq AI and 3rd party APIs"""
        
        # Decode base64 image
        try:
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            # Here you would typically:
            # 1. Save image temporarily
            # 2. Use 3rd party APIs for analysis
            # 3. Process the results
            
            # For demo purposes, we'll simulate some analysis
            analysis_data = {
                "image_analysis": {
                    "color_profile": "brown_dark",
                    "texture_estimate": "clay_loam",
                    "moisture_level": "moderate"
                },
                "location_data": None
            }
            
            # If location provided, call 3rd party API (example)
            if lat and long:
                try:
                    # Example: Using OpenWeatherMap API (you'd replace with actual soil/weather API)
                    weather_response = requests.get(
                        f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={long}&appid={os.getenv('WEATHER_API_KEY')}"
                    )
                    if weather_response.status_code == 200:
                        weather_data = weather_response.json()
                        analysis_data["location_data"] = {
                            "temperature": weather_data.get("main", {}).get("temp"),
                            "humidity": weather_data.get("main", {}).get("humidity"),
                            "weather": weather_data.get("weather", [{}])[0].get("main")
                        }
                except Exception as e:
                    print(f"Error fetching location data: {e}")
            
            # Generate AI response using Groq
            prompt = f"""
            Analyze this soil data and provide recommendations:
            
            Image Analysis: {analysis_data['image_analysis']}
            Location Data: {analysis_data.get('location_data', 'Not available')}
            
            Provide:
            1. Soil type assessment
            2. Nutrient content estimate
            3. Suitable crops
            4. Improvement recommendations
            5. Water requirements
            """
            
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert soil scientist and agronomist. Provide detailed, practical advice for soil management and crop selection."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="openai/gpt-oss-120b",  # or any other Groq model
                temperature=0.7,
                max_tokens=1000
            )
            
            ai_response = chat_completion.choices[0].message.content
            
            return {
                "analysis": analysis_data,
                "ai_response": ai_response,
                "recommendations": {
                    "suitable_crops": ["Wheat", "Corn", "Soybeans"],
                    "fertilizer_suggestions": ["NPK 10-10-10", "Compost"],
                    "watering_schedule": "Every 3 days"
                }
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error analyzing soil: {str(e)}"
            )

ai_service = AIService()

# Database Models
class DatabaseModels:
    @staticmethod
    async def save_user_history(db, user_id: str, request: SoilAnalysisRequest, ai_response: dict):
        history_entry = {
            "searchedImg": request.soil_image[:100] + "..." if len(request.soil_image) > 100 else request.soil_image,
            "lat": str(request.lat) if request.lat else None,
            "long": str(request.long) if request.long else None,
            "timestamp": datetime.utcnow(),
            "ai_response": ai_response.get("ai_response", "")[:500] + "..."  # Store truncated response
        }
        
        await db.users.update_one(
            {"_id": user_id},
            {"$push": {"history": history_entry}}
        )
    
    @staticmethod
    async def save_ai_chat_history(db, user_id: str, user_message: str, ai_response: str):
        chat_entry = {
            "user_message": user_message,
            "ai_response": ai_response,
            "timestamp": datetime.utcnow()
        }
        
        # Check if AI response document exists
        ai_doc = await db.ai_responses.find_one({"user_id": user_id})
        
        if ai_doc:
            await db.ai_responses.update_one(
                {"user_id": user_id},
                {"$push": {"chatHistory": chat_entry}}
            )
        else:
            ai_response_doc = {
                "_id": str(uuid.uuid4()),
                "user_id": user_id,
                "chatHistory": [chat_entry]
            }
            await db.ai_responses.insert_one(ai_response_doc)

db_models = DatabaseModels()

# Routes
@app.on_event("startup")
async def startup_db_client():
    await db_client.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    await db_client.close()

@app.post("/register", response_model=dict)
async def register_user(user: UserCreate, db = Depends(get_database)):
    """Register a new user"""
    return await user_manager.create_user(db, user)

@app.post("/login", response_model=Token)
async def login(user: UserLogin, db = Depends(get_database)):
    """User login"""
    authenticated_user = await user_manager.authenticate_user(db, user.email, user.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # In production, generate proper JWT token
    # For simplicity, we're using user_id as token
    return {
        "access_token": authenticated_user["_id"],
        "token_type": "bearer"
    }

@app.post("/ask/ai", response_model=dict)
async def ask_ai(
    request: SoilAnalysisRequest,
    current_user: dict = Depends(user_manager.get_current_user),
    db = Depends(get_database)
):
    """Analyze soil image with optional location data"""
    
    # Analyze soil using AI
    analysis_result = await ai_service.analyze_soil(
        request.soil_image,
        request.lat,
        request.long
    )
    
    # Save user history
    await db_models.save_user_history(
        db,
        current_user["_id"],
        request,
        analysis_result
    )
    
    # Save AI chat history
    await db_models.save_ai_chat_history(
        db,
        current_user["_id"],
        f"Soil analysis request with image and location: lat={request.lat}, long={request.long}",
        analysis_result["ai_response"]
    )
    
    return {
        "status": "success",
        "user_id": current_user["_id"],
        "analysis": analysis_result["analysis"],
        "ai_response": analysis_result["ai_response"],
        "recommendations": analysis_result["recommendations"],
        "timestamp": datetime.utcnow()
    }


    """General chat with AI about soil"""
    
    # Prepare prompt based on message
    prompt = f"""
    User question: {message.user_message}
    @app.post("/chat", response_model=dict)
async def chat_with_ai(
    message: UserMessage,
    current_user: dict = Depends(user_manager.get_current_user),
    db = Depends(get_database)
):
    """General chat with AI about soil with image analysis"""
    
    try:
        image_features = None
        location_context = None
        
        # If soil image is provided, analyze it
        if message.soil_image:
            try:
                image_bytes = base64.b64decode(message.soil_image)
                image_features = await AIService.extract_image_features(image_bytes)
                
                if image_features:
                    # Get location context if available
                    if message.lat and message.long:
                        location_context = await AIService.get_location_context(message.lat, message.long)
            except Exception as e:
                print(f"Image analysis in chat error: {e}")
                # Continue without image features
        
        # Build prompt with context
        prompt_parts = []
        
        # Add image analysis if available
        if image_features:
            prompt_parts.append(f"""
SOIL IMAGE ANALYSIS CONTEXT:
- Soil Color: {image_features['color_name']}
- Texture: {image_features['texture_estimate']}
- Moisture Level: {image_features['moisture_estimate']}
- Organic Matter: {image_features['organic_matter_estimate']}
- Image Hash: {image_features['image_hash']}
""")
        
        # Add location context if available
        if location_context:
            prompt_parts.append(f"""
LOCATION CONTEXT:
- Coordinates: {location_context['coordinates']}
- Weather: Temperature: {location_context['weather']['temperature']}°C, Humidity: {location_context['weather']['humidity']}%
""")
        
        # Add user message
        prompt_parts.append(f"""
USER QUESTION: {message.user_message}
""")
        
        # Final prompt
        final_prompt = "\n".join(prompt_parts)
        
        # Get AI response with structured guidance
        chat_prompt = f"""
        {final_prompt}
        
        You are an expert soil scientist and agronomist. The user has provided the above information.
        
        Please provide a comprehensive, practical response that:
        1. Addresses the user's specific question: "{message.user_message}"
        2. References the soil image analysis data if provided
        3. Provides actionable recommendations
        4. Considers location context if available
        5. Uses clear, understandable language for farmers
        
        Structure your response with:
        - Brief summary of the analysis
        - Direct answer to the question
        - Specific recommendations
        - Additional considerations
        
        Be detailed but practical. Avoid overly technical jargon unless necessary.
        """
        
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert soil scientist with 20+ years of field experience.
                    You provide practical, actionable advice to farmers and agricultural professionals.
                    You explain complex concepts in simple terms.
                    You always consider the specific context provided (soil type, location, etc.).
                    You are helpful, patient, and thorough in your explanations."""
                },
                {
                    "role": "user",
                    "content": chat_prompt
                }
            ],
            model="mixtral-8x7b-32768",
            temperature=0.7,
            max_tokens=1500
        )
        
        ai_response = chat_completion.choices[0].message.content
        
        # Extract key insights for metadata
        response_metadata = {
            "has_image_analysis": bool(image_features),
            "image_hash": image_features.get('image_hash') if image_features else None,
            "has_location": bool(location_context),
            "query_type": AIService._classify_query_type(message.user_message)
        }
        
        # Save chat history with metadata
        chat_entry = {
            "user_message": message.user_message,
            "ai_response": ai_response,
            "metadata": response_metadata,
            "image_features": image_features if image_features else None,
            "location_context": location_context,
            "timestamp": datetime.utcnow()
        }
        
        # Check if AI response document exists
        ai_doc = await db.ai_responses.find_one({"user_id": current_user["_id"]})
        
        if ai_doc:
            await db.ai_responses.update_one(
                {"user_id": current_user["_id"]},
                {"$push": {"chatHistory": chat_entry}}
            )
        else:
            ai_response_doc = {
                "_id": str(uuid.uuid4()),
                "user_id": current_user["_id"],
                "chatHistory": [chat_entry]
            }
            await db.ai_responses.insert_one(ai_response_doc)
        
        return {
            "status": "success",
            "user_id": current_user["_id"],
            "ai_response": ai_response,
            "metadata": response_metadata,
            "image_analysis": image_features if image_features else None,
            "location_context": location_context,
            "timestamp": datetime.utcnow()
        }
        
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat failed: {str(e)}"
        )

# Add this helper method to the AIService class
class AIService:
    # ... (previous methods remain the same) ...
    
    @staticmethod
    def _classify_query_type(query: str) -> str:
        """Classify the type of user query"""
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['crop', 'plant', 'grow', 'harvest']):
            return "crop_selection"
        elif any(word in query_lower for word in ['fertilizer', 'nutrient', 'npk', 'compost']):
            return "fertilizer_advice"
        elif any(word in query_lower for word in ['water', 'irrigat', 'moisture', 'drain']):
            return "water_management"
        elif any(word in query_lower for word in ['problem', 'issue', 'disease', 'pest', 'yellow', 'brown']):
            return "problem_solving"
        elif any(word in query_lower for word in ['soil type', 'test', 'analysis', 'ph', 'texture']):
            return "soil_analysis"
        elif any(word in query_lower for word in ['improve', 'amend', 'quality', 'health']):
            return "soil_improvement"
        else:
            return "general_advice"
    Additional context:
    - Soil image provided: {'Yes' if message.soil_image else 'No'}
    - Location: lat={message.lat}, long={message.long}
    
    Please provide expert advice as a soil scientist.
    """
    
    # Get AI response
    chat_completion = groq_client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are an expert soil scientist and agronomist. Provide detailed, practical advice."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="openai/gpt-oss-120b",
        temperature=0.7,
        max_tokens=800
    )
    
    ai_response = chat_completion.choices[0].message.content
    
    # Save chat history
    await db_models.save_ai_chat_history(
        db,
        current_user["_id"],
        message.user_message,
        ai_response
    )
    
    return {
        "status": "success",
        "user_id": current_user["_id"],
        "ai_response": ai_response,
        "timestamp": datetime.utcnow()
    }

@app.get("/user/history", response_model=dict)
async def get_user_history(
    current_user: dict = Depends(user_manager.get_current_user),
    db = Depends(get_database)
):
    """Get user's search history"""
    user = await db.users.find_one(
        {"_id": current_user["_id"]},
        {"history": 1, "username": 1, "email": 1}
    )
    
    return {
        "user_id": user["_id"],
        "username": user["username"],
        "email": user["email"],
        "history": user.get("history", []),
        "total_searches": len(user.get("history", []))
    }

@app.get("/user/chat-history", response_model=dict)
async def get_chat_history(
    current_user: dict = Depends(user_manager.get_current_user),
    db = Depends(get_database)
):
    """Get user's AI chat history"""
    ai_doc = await db.ai_responses.find_one({"user_id": current_user["_id"]})
    
    if not ai_doc:
        return {
            "user_id": current_user["_id"],
            "chatHistory": [],
            "total_chats": 0
        }
    
    return {
        "user_id": current_user["_id"],
        "chatHistory": ai_doc.get("chatHistory", []),
        "total_chats": len(ai_doc.get("chatHistory", []))
    }

@app.get("/health")
async def health_check(db = Depends(get_database)):
    """Health check endpoint"""
    try:
        # Test database connection
        await db.command("ping")
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection failed: {str(e)}"
        )

# Run the application
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(
#         "main:app",
#         host="0.0.0.0",
#         port=8000,
#         reload=True
#     )