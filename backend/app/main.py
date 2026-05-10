from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.projects import router as projects_router
from app.routes.docks import router as docks_router
from app.routes.missions import router as missions_router
from app.routes.execute import router as execute_router

app = FastAPI()

app.include_router(projects_router)
app.include_router(docks_router)
app.include_router(missions_router)
app.include_router(execute_router)

#incluir CORS middleware para permitir requisições de qualquer origem
#incluir os imports necessários para os routers de docks, missions e execute



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

