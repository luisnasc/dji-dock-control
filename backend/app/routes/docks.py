from fastapi import APIRouter

router = APIRouter(prefix="/docks")

# create a route that returns mock DJI docks for a project
@router.get("/projects/{project_id}/docks")
def get_docks(project_id: int):
    return [
        {
            "id": 1,
            "name": "DJI Dock 2",
            "project_id": project_id,
            "status": "Online",
            "local": "Pátio 500kV",
            "drone": {
                "model": "DJI Matrice 3D",
                "status": "Disponível",
                "battery": 98
            }
        },
        {
            "id": 2,
            "name": "DJI Dock 2",
            "project_id": project_id,
            "status": "Online",
            "local": "Casa de Força",
            "drone": {
                "model": "DJI Matrice 3TD",
                "status": "Em carregamento",
                "battery": 76
            }
        }
    ]