import hmac
import os
import time
import mysql.connector
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify

load_dotenv(override=True)
app = Flask(__name__)

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "termometro"),
}

PERGUNTAS = [
    "Como está sua energia hoje, diante de todas as tarefas e informações que você precisa administrar?",
    "Você consegue desacelerar sua mente e se desligar das preocupações quando o dia termina?",
    "Como está sua tranquilidade emocional neste momento, mesmo diante das pressões e imprevistos do dia a dia?",
    "Você tem conseguido reservar algum tempo para cuidar de si e das suas necessidades emocionais?",
    "Você consegue perceber quando está chegando ao seu limite, antes que o corpo ou as emoções peçam socorro?",
    "Hoje, como você percebe o equilíbrio entre suas responsabilidades, suas preocupações e seus momentos de leveza?",
]
ROTULOS = ["Energia", "Desacelerar", "Tranquilidade", "Autocuidado", "Perceber limites", "Leveza"]

FAIXAS = {
    "equilibrio": {
        "titulo": "Jardim em equilíbrio",
        "texto": "Neste momento, você percebe que está conseguindo conciliar suas demandas com momentos de cuidado e bem-estar.",
        "geral": "Em geral, as pessoas estão conseguindo conciliar suas demandas com momentos de cuidado.",
    },
    "atencao": {
        "titulo": "Jardim pedindo atenção",
        "texto": "Talvez algumas áreas estejam exigindo mais energia do que você consegue repor. É um convite para observar onde pequenos ajustes e cuidados podem ajudar.",
        "geral": "Em geral, o jardim de todos pede atenção: há áreas exigindo mais energia do que se consegue repor.",
    },
    "cuidado": {
        "titulo": "Jardim precisando de cuidado",
        "texto": "Este pode ser um momento de maior sobrecarga. Talvez seja hora de olhar com mais atenção para suas necessidades e pensar em formas de cuidado e apoio.",
        "geral": "Em geral, as pessoas estão em um momento de maior sobrecarga e precisam de cuidado.",
    },
}


def classificar(total):
    if total >= 48:
        return "equilibrio"
    if total >= 30:
        return "atencao"
    return "cuidado"


def conectar():
    return mysql.connector.connect(**DB_CONFIG)


@app.get("/")
def index():
    return render_template("index.html", perguntas=PERGUNTAS, erro=None)


@app.post("/enviar")
def enviar():
    try:
        notas = [int(request.form[f"q{i}"]) for i in range(1, 7)]
        if any(n < 0 or n > 10 for n in notas):
            raise ValueError
    except (KeyError, ValueError):
        erro = "Responda todas as perguntas com uma nota de 0 a 10."
        return render_template("index.html", perguntas=PERGUNTAS, erro=erro), 400

    total = sum(notas)
    faixa = classificar(total)

    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO respostas (q1, q2, q3, q4, q5, q6, total, faixa) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            (*notas, total, faixa),
        )
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as e:
        print("Erro ao salvar:", e)
        erro = "Não foi possível salvar sua resposta agora. Tente de novo em instantes."
        return render_template("index.html", perguntas=PERGUNTAS, erro=erro), 500

    return render_template("obrigada.html", total=total, faixa=FAIXAS[faixa])


@app.get("/resultados")
def resultados():
    return render_template("resultados.html")


@app.get("/api/resultados")
def api_resultados():
    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT COUNT(*), AVG(total), AVG(q1), AVG(q2), AVG(q3), AVG(q4), AVG(q5), AVG(q6), "
            "SUM(faixa = 'equilibrio'), SUM(faixa = 'atencao'), SUM(faixa = 'cuidado') FROM respostas"
        )
        linha = cursor.fetchone()
        cursor.close()
        conn.close()
    except mysql.connector.Error as e:
        print("Erro ao ler:", e)
        return jsonify(erro="Não foi possível carregar os resultados."), 500

    if not linha or linha[0] == 0:
        return jsonify(total=0)

    media_total = round(float(linha[1]), 1)
    faixa = FAIXAS[classificar(media_total)]
    return jsonify(
        total=int(linha[0]),
        media_total=media_total,
        titulo=faixa["titulo"],
        mensagem=faixa["geral"],
        contagem=[int(x) for x in linha[8:11]],
        rotulos=ROTULOS,
        medias=[round(float(x), 1) for x in linha[2:8]],
    )


@app.post("/api/zerar")
def api_zerar():
    senha_correta = os.getenv("ADMIN_SENHA", "")
    if not senha_correta:
        return jsonify(erro="Defina ADMIN_SENHA no arquivo .env e reinicie o programa."), 403

    dados = request.get_json(silent=True) or {}
    senha = str(dados.get("senha", ""))
    if not hmac.compare_digest(senha.encode(), senha_correta.encode()):
        time.sleep(1)
        return jsonify(erro="Senha incorreta."), 403

    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("TRUNCATE TABLE respostas")
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as e:
        print("Erro ao zerar:", e)
        return jsonify(erro="Não foi possível zerar as respostas agora."), 500

    return jsonify(ok=True)



@app.get("/api/respostas-recentes")
def api_respostas_recentes():
    try:
        limite = max(1, min(int(request.args.get("limite", 10)), 50))
    except ValueError:
        limite = 10

    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("SELECT id, total FROM respostas ORDER BY id DESC LIMIT %s", (limite,))
        linhas = cursor.fetchall()
        cursor.close()
        conn.close()
    except mysql.connector.Error as e:
        print("Erro ao ler:", e)
        return jsonify(erro="Não foi possível carregar as respostas."), 500

    return jsonify(respostas=[{"id": i, "pontos": t} for i, t in reversed(linhas)])


if __name__ == "__main__":
    app.run(debug=True)
