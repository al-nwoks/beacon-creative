from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_files():
    return {"message": "Project files endpoint is working."}
