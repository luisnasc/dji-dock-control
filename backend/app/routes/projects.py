from fastapi import APIRouter

router = APIRouter(prefix="/projects")

# create a route that returns mock DJI projects
@router.get("/")
def get_projects():
    return [
        {
            "id": 1,
            "name": "SE Adrianópolis",
            "type": "Subestação",
            "description": "Inspeções autônomas com DJI Dock no pátio 500kV",
            "status": "Operacional",
            "location": "Rio de Janeiro - RJ"
        },
        {
            "id": 2,
            "name": "SE Foz do Iguaçu",
            "type": "Subestação",
            "description": "Monitoramento de ativos críticos e inspeções termográficas",
            "status": "Operacional",
            "location": "Foz do Iguaçu - PR"
        },
        {
            "id": 3,
            "name": "SE Jacarepaguá",
            "type": "Subestação",
            "description": "Inspeções automatizadas de barramentos e transformadores",
            "status": "Em implantação",
            "location": "Rio de Janeiro - RJ"
        }
    ]