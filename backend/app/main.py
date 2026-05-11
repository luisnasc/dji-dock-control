from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.projects import router as projects_router
from app.routes.docks import router as docks_router
from app.routes.missions import router as missions_router
from app.routes.execute import router as execute_router

from app.services.dji_service import FlightHubClient

app = FastAPI()

app.include_router(projects_router)
app.include_router(docks_router)
app.include_router(missions_router)
app.include_router(execute_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = FlightHubClient()
@app.get("/test-flighthub")
def test_flighthub():
    return client.test_connection()


@app.get("/")
def root():
    return {"message": "API funcionando"}