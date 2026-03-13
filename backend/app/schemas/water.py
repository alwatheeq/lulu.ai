from typing import Optional
from pydantic import BaseModel
from datetime import datetime

# Shared properties
class WaterBase(BaseModel):
    amount: int  # in mL
    timestamp: Optional[datetime] = None

# Properties to receive on item creation
class WaterCreate(WaterBase):
    pass

# Properties shared by models stored in DB
class WaterInDBBase(WaterBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Properties to return to client
class Water(WaterInDBBase):
    pass
