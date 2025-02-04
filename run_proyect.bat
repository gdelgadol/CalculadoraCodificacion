@echo off
echo Checking for virtual environment...

:: Check if the virtual environment exists
IF NOT EXIST .venv (
    echo Virtual environment not found. Creating it...
    python -m venv .venv
)

:: Activate the virtual environment
call .venv\Scripts\activate

:: Install the required dependencies
pip install -q -r requirements.txt

:: Run the FastAPI app
uvicorn main:app --reload
