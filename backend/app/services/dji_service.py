import requests

from app.core.config import settings

class FlightHubClient:

    def __init__(self):
        self.base_url = settings.DJI_BASE_URL

        self.headers = {
            "Content-Type": "application/json",
            "X-User-Token": settings.DJI_BASE_URL,
            "X-Project-Uuid": settings.DJI_PROJECT_ID,
            'X-Language': 'en'

        }

    def test_connection(self):

        url = f"{self.base_url}/openapi/v0.1/system_status"
        print(f"Testing connection to DJI FlightHub at {url} with headers: {self.headers}")
        response = requests.get(
            url,
            headers=self.headers
        )

        return {
            "status_code": response.status_code,
            "response": response.text
        }