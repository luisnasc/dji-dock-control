from fastapi import APIRouter

router = APIRouter(prefix="/docks")

# Mock data for docks
docks_data = {
    1: {
        "id": 1,
        "name": "DJI Dock 3",
        "project_id": 1,
        "status": "Online",
        "local": "Pátio 500kV",
        "drone": {
            "model": "DJI Matrice 4TD",
            "status": "Disponível",
            "battery": 98
        }
    },
    2: {
        "id": 2,
        "name": "DJI Dock 2",
        "project_id": 2,
        "status": "Online",
        "local": "Casa de Força",
        "drone": {
            "model": "DJI Matrice 3TD",
            "status": "Em carregamento",
            "battery": 76
        }
    }
}

# create a route that returns mock DJI docks for a project
@router.get("/projects/{project_id}/docks")
def get_docks(project_id: int):
    dock = docks_data.get(project_id)
    return [dock] if dock else []