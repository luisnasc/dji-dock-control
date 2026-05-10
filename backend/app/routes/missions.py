from fastapi import APIRouter

router = APIRouter(prefix="/missions")

# Mock data for missions
missions_data = [
    {
        "id": 1,
        "name": "Inspeção Transformadores - 138kV",
        "project_id": 1,
        "dock_id": 1,
        "status": "Salva",
        "duracao": "12 min"
    },
    {
        "id": 2,
        "name": "Inspeção Disjuntores",
        "project_id": 1,
        "dock_id": 1,
        "status": "Executada",
        "duracao": "8 min"
    },
    {
        "id": 3,
        "name": "Inspeção Seccionadoras",
        "project_id": 2,
        "dock_id": 2,
        "status": "Agendada",
        "duracao": "15 min"
    },
    {
        "id": 4,
        "name": "Inspeção Patio 500kV",
        "project_id": 1,
        "dock_id": 2,
        "status": "Agendada",
        "duracao": "20 min"
    },
        {
        "id": 6,
        "name": "Ronda noturna",
        "project_id": 1,
        "dock_id": 2,
        "status": "Agendada",
        "duracao": "20 min"
    }
]

# criar rotas para retornar missões mock para um projeto
@router.get("/projects/{project_id}/missions")
def get_missions(project_id: int):
    return [mission for mission in missions_data if mission["project_id"] == project_id]