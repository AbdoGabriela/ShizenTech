# Shizen Tech · Jardim

Flask + MySQL. O Python entrega as páginas HTML e grava as notas no banco.

## Abrir e rodar no VS Code
1. Descompacte o zip. No VS Code: **Arquivo > Abrir Pasta** e escolha `ShizenTech-Jardim`.
2. Aceite instalar a extensão **Python** quando o VS Code sugerir.
3. Abra o terminal (**Ctrl + '**) e crie o ambiente virtual:
   - `python -m venv .venv`
   - Ative: Windows `.venv\Scripts\activate` | Linux/Mac `source .venv/bin/activate`
   - Se o VS Code perguntar sobre o novo ambiente, clique em **Sim**.
4. `pip install -r requirements.txt`
5. Copie `.env.example` para `.env` e coloque a senha do seu MySQL em `DB_PASSWORD`.
6. Com o MySQL ligado, rode `python criar_banco.py` (cria o banco e a tabela).
7. Aperte **F5** (ou rode `python app.py`) e abra http://127.0.0.1:5000

Páginas: `/` (perguntas), `/resultados` (gráficos de todos).

## Zerar as respostas
Na tela "Jardim de todos" há o botão "Zerar todas as respostas". Ele pede a senha definida em `ADMIN_SENHA` no arquivo `.env` (reinicie o programa depois de editar o `.env`).
