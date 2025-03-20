from pydantic import BaseModel, Field
from typing import List
from datetime import datetime, timezone

class Answer(BaseModel):
    question: str
    category: str
    selected_index: int
    correct_index: int
    is_correct: bool
    explanation: str
    response_time: float = Field(default=0.0)  # Track how long user took to answer
    confidence_level: str = Field(default="medium")  # Based on response time
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserAnswers(BaseModel):
    user_id: str
    answers: List[Answer]