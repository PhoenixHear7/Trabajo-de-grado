from flask import Flask
from routes.turnos_routes import turnos_bp
from routes.veterinarios_routes import veterinarios_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Registrar las rutas
app.register_blueprint(turnos_bp, url_prefix="/turnos")
app.register_blueprint(veterinarios_bp, url_prefix="/veterinarios")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
