from flask import Flask, render_template
from routes.turnos_routes import turnos_bp
from routes.veterinarios_routes import veterinarios_bp
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# Registrar las rutas
app.register_blueprint(turnos_bp, url_prefix="/turnos")
app.register_blueprint(veterinarios_bp, url_prefix="/veterinarios")

@app.route("/moduloMedico")
def modulo_medico():
    return render_template("moduloMedico.html")

@app.route("/ajusteMedicos")
def ajuste_medicos():
    return render_template("ajusteMedicos.html")

@app.route("/pantallaPrincipal")
def pantalla_principal():
    return render_template("pantallaPrincipal.html")

@app.route("/tv")
def tv():
    return render_template("tv.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
