from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class SoilTexture(str, Enum):
    SANDY = "sandy"
    LOAMY = "loamy"
    CLAY = "clay"
    SILT = "silt"
    CLAY_LOAM = "clay_loam"
    SANDY_LOAM = "sandy_loam"

class SoilAnalysis(BaseModel):
    soil_type: Optional[SoilTexture] = None
    ph: Optional[float] = None
    organic_matter: Optional[str] = None
    nitrogen: Optional[str] = None
    phosphorus: Optional[str] = None
    potassium: Optional[str] = None
    moisture: Optional[str] = None
    color: Optional[str] = None
    texture_description: Optional[str] = None
    deficiencies: Optional[List[str]] = None
    recommendations: Optional[List[str]] = None

class Location(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)

class SearchHistory(BaseModel):
    timestamp: datetime
    image_url: Optional[str] = None
    location: Optional[Location] = None
    soil_analysis: SoilAnalysis
    plantix_raw_data: Optional[Dict[str, Any]] = None

class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    username: str
    email: EmailStr
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.now)
    search_history: List[SearchHistory] = Field(default_factory=list)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class SoilImageRequest(BaseModel):
    location: Optional[Location] = None