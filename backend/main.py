import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

from flask import Flask
from flask_cors import CORS

from database.database import db
from routers.autenticacion_routes import autenticacion_bp
from routers.usuario_routes import usuario_bp
from routers.paciente_routes import paciente_bp
from routers.medico_routes import medico_bp
from routers.citas_routes import citas_bp
from models import usuario, paciente, administrador, medico, cita

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://"
    f"{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}"
    f"/{os.getenv('DB_NAME')}"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(autenticacion_bp)
app.register_blueprint(usuario_bp)
app.register_blueprint(paciente_bp)
app.register_blueprint(medico_bp)
app.register_blueprint(citas_bp)

with app.app_context():
    db.create_all()
    print("Conexión a MySQL exitosa y tablas verificadas")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)