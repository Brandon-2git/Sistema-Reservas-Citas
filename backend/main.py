
from dotenv import load_dotenv
load_dotenv()

from flask import Flask
import os

from database.database import db
from routers.autenticacion_routes import autenticacion_bp
from routers.usuario_routes import usuario_bp
from models import usuario, paciente, administrador, medico


app = Flask(__name__)

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

with app.app_context():
    db.engine.connect()
    print("Conexión a MySQL exitosa y tablas verificadas")


if __name__ == "__main__":
    app.run(debug=True)