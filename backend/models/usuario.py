from database.database import db

class Usuario(db.Model):
    __tablename__= "usuarios"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellidoPaterno = db.Column(db.String(100), nullable=False)
    apellidoMaterno = db.Column(db.String(100), nullable=True)
    fechaNacimiento = db.Column(db.Date, nullable=True)
    correo = db.Column(db.String(150), unique=True, nullable=False)
    telefono = db.Column(db.String(20), nullable=True)
    contrasena = db.Column(db.String(255), nullable=False)
    activo = db.Column(db.Boolean, default=True, nullable=False)

    #tipo guarda el tipo de usuario es
    tipo = db.Column(db.String(20), nullable=False)

    # __mapper_args__ hace que SQLAlchemy use ese valor para distinguir
    # entre usuario, paciente, medico o administrador
    __mapper_args__ ={
        "polymorphic_identity" : "usuario",
        "polymorphic_on" : tipo,
    }
