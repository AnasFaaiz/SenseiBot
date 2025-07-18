import os
import mysql.connector
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Gemini AI Configuration ---
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    print("✅ Gemini AI configured successfully.")
except Exception as e:
    print(f"❌ Gemini AI configuration failed: {e}")
    gemini_model = None

# --- FastAPI App ---
app = FastAPI()

# --- Database Connection Management (This is the robust way) ---
def get_db_connection():
    try:
        # Get a new connection for each request
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            database=os.getenv("DB_DATABASE"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD")
        )
        yield conn
    finally:
        # Close the connection after the request is finished
        if 'conn' in locals() and conn.is_connected():
            conn.close()

# --- Database Table Creation on Startup ---
@app.on_event("startup")
def startup_event():
    try:
        # Use a temporary connection just for startup
        with next(get_db_connection()) as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                CREATE TABLE IF NOT EXISTS used_terms (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  term VARCHAR(255) NOT NULL,
                  category VARCHAR(255) NOT NULL,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                """)
                conn.commit()
                print("✅ 'used_terms' table is ready.")
    except mysql.connector.Error as err:
        print(f"❌ Database connection or table creation failed: {err}")

# --- Pydantic Models ---
class TermRequest(BaseModel):
    category: str
    userId: str

class TermResponse(BaseModel):
    termName: str
    termDefinition: str

# --- API Endpoint ---
@app.post("/v1/generate-term", response_model=TermResponse)
async def generate_term(request: TermRequest, db_conn: mysql.connector.MySQLConnection = Depends(get_db_connection)):
    if not gemini_model:
        raise HTTPException(status_code=503, detail="AI service is not available.")
    if not db_conn:
        raise HTTPException(status_code=503, detail="Database service is not available.")

    try:
        with db_conn.cursor() as cursor:
            # 1. Fetch recent terms
            cursor.execute("""
                SELECT term FROM used_terms
                WHERE category = %s AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                ORDER BY timestamp DESC LIMIT 50
            """, (request.category,))
            recent_terms = [row[0] for row in cursor.fetchall()]

            # 2. Build prompt
            prompt = f"Give me one important and trending {request.category} term of the day with its definition. Format it as 'Term: Definition'. The definition should be concise (under 60 words)."
            if recent_terms:
                prompt += f" Do not use any of the following terms: {', '.join(recent_terms)}."

            # 3. Call Gemini API
            response = gemini_model.generate_content(prompt)
            ai_response_text = response.text

            # 4. Parse response
            parts = ai_response_text.split(':', 1)
            if len(parts) < 2:
                raise HTTPException(status_code=500, detail="AI response format error.")
            
            term_name = parts[0].strip()
            term_definition = parts[1].strip()

            # 5. Save new term
            cursor.execute(
                "INSERT INTO used_terms (term, category) VALUES (%s, %s)",
                (term_name, request.category)
            )
            db_conn.commit()
            print(f"Saved new term '{term_name}' to the database for category '{request.category}'.")

            return TermResponse(termName=term_name, termDefinition=term_definition)

    except Exception as e:
        print(f"❌ Error during term generation: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate term.")
