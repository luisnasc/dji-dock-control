from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    DJI_APP_ID = os.getenv("DJI_APP_ID")
    DJI_APP_KEY = os.getenv("DJI_APP_KEY")
    DJI_APP_SECRET = os.getenv("DJI_APP_SECRET")
    DJI_BASE_URL = os.getenv("DJI_BASE_URL")
    DJI_ORG_ID = os.getenv("DJI_ORG_ID")
    DJI_PROJECT_ID = os.getenv("DJI_PROJECT_ID")

settings = Settings()