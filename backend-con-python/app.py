from flask import Flask, render_template
from routes.turnos_routes import turnos_bp
from routes.veterinarios_routes import veterinarios_bp
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# Registrar las rutas
app.register_blueprint(turnos_bp)
app.register_blueprint(veterinarios_bp, url_prefix="/veterinarios")

@app.route("/moduloMedico")
def modulo_medico():
    return render_template("moduloMedico.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
