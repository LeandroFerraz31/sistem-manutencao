from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd
from io import BytesIO
import base64
from datetime import datetime

app = Flask(__name__)

from flask import render_template

@app.route('/')
def index():
    return render_template('index.html')

# Configuração explícita de CORS para todos os endpoints /api/*
CORS(app, resources={r"/api/*": {"origins": [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:5000",  # ← Adicione esta linha
    "http://localhost:5000",   # ← Adicione esta linha
    "https://sistem-manutencao.onrender.com"
]}})

def init_db():
    conn = sqlite3.connect('manutencoes.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS manutencoes
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  data TEXT,
                  placa TEXT,
                  motorista TEXT,
                  tipo TEXT,
                  oc TEXT,
                  valor REAL,
                  pix TEXT,
                  favorecido TEXT,
                  local TEXT,
                  defeito TEXT)''')
    conn.commit()
    conn.close()

init_db()

def validate_date(date_str):
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False

@app.route('/api/manutencoes', methods=['POST'])
def add_manutencao():
    data = request.json
    try:
        required_fields = ['data', 'placa', 'motorista', 'tipo', 'valor', 'local', 'defeito']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        if missing_fields:
            return jsonify({'error': f'Campos obrigatórios ausentes: {", ".join(missing_fields)}'}), 400

        if not validate_date(data['data']):
            return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD.'}), 400

        valor = float(data['valor'])
        if valor < 0:
            return jsonify({'error': 'Valor deve ser maior ou igual a zero.'}), 400

        conn = sqlite3.connect('manutencoes.db')
        c = conn.cursor()
        c.execute('''INSERT INTO manutencoes (data, placa, motorista, tipo, oc, valor, pix, favorecido, local, defeito)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                  (data['data'], data['placa'].upper(), data['motorista'], data['tipo'], data.get('oc', ''),
                   valor, data.get('pix', ''), data.get('favorecido', ''), data['local'], data['defeito']))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Manutenção adicionada com sucesso'}), 201
    except ValueError:
        return jsonify({'error': 'Valor deve ser um número válido.'}), 400
    except Exception as e:
        return jsonify({'error': f'Erro ao adicionar manutenção: {str(e)}'}), 500

@app.route('/api/manutencoes', methods=['GET'])
def get_manutencoes():
    try:
        conn = sqlite3.connect('manutencoes.db')
        c = conn.cursor()
        c.execute('SELECT * FROM manutencoes')
        manutencoes = [{'id': row[0], 'data': row[1], 'placa': row[2], 'motorista': row[3], 'tipo': row[4],
                        'oc': row[5], 'valor': row[6], 'pix': row[7], 'favorecido': row[8], 'local': row[9],
                        'defeito': row[10]} for row in c.fetchall()]
        conn.close()
        return jsonify(manutencoes)
    except Exception as e:
        return jsonify({'error': f'Erro ao carregar manutenções: {str(e)}'}), 500

@app.route('/api/manutencoes/<int:id>', methods=['PUT'])
def update_manutencao(id):
    data = request.json
    try:
        required_fields = ['data', 'placa', 'motorista', 'tipo', 'valor', 'local', 'defeito']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        if missing_fields:
            return jsonify({'error': f'Campos obrigatórios ausentes: {", ".join(missing_fields)}'}), 400

        if not validate_date(data['data']):
            return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD.'}), 400

        valor = float(data['valor'])
        if valor < 0:
            return jsonify({'error': 'Valor deve ser maior ou igual a zero.'}), 400

        conn = sqlite3.connect('manutencoes.db')
        c = conn.cursor()
        c.execute('''UPDATE manutencoes SET data = ?, placa = ?, motorista = ?, tipo = ?, oc = ?, valor = ?, 
                     pix = ?, favorecido = ?, local = ?, defeito = ? WHERE id = ?''',
                  (data['data'], data['placa'].upper(), data['motorista'], data['tipo'], data.get('oc', ''),
                   valor, data.get('pix', ''), data.get('favorecido', ''), data['local'], data['defeito'], id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Manutenção atualizada com sucesso'}), 200
    except ValueError:
        return jsonify({'error': 'Valor deve ser um número válido.'}), 400
    except Exception as e:
        return jsonify({'error': f'Erro ao atualizar manutenção: {str(e)}'}), 500

@app.route('/api/manutencoes/<int:id>', methods=['DELETE'])
def delete_manutencao(id):
    try:
        conn = sqlite3.connect('manutencoes.db')
        c = conn.cursor()
        c.execute('DELETE FROM manutencoes WHERE id = ?', (id,))
        if c.rowcount == 0:
            return jsonify({'error': 'Manutenção não encontrada'}), 404
        conn.commit()
        conn.close()
        return jsonify({'message': 'Manutenção deletada com sucesso'})
    except Exception as e:
        return jsonify({'error': f'Erro ao deletar manutenção: {str(e)}'}), 500

@app.route('/api/relatorios', methods=['POST'])
def gerar_relatorio():
    data = request.json
    try:
        data_inicio = data.get('data_inicio')
        data_fim = data.get('data_fim')
        placa = data.get('placa', '').upper()

        if not data_inicio or not data_fim:
            return jsonify({'error': 'Datas de início e fim são obrigatórias'}), 400

        if not validate_date(data_inicio) or not validate_date(data_fim):
            return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD.'}), 400

        if data_inicio > data_fim:
            return jsonify({'error': 'Data de início não pode ser maior que data de fim'}), 400

        conn = sqlite3.connect('manutencoes.db')
        c = conn.cursor()
        
        query = 'SELECT * FROM manutencoes WHERE data BETWEEN ? AND ?'
        params = [data_inicio, data_fim]
        
        if placa:
            query += ' AND placa = ?'
            params.append(placa)
        
        c.execute(query, params)
        manutencoes = [{'id': row[0], 'data': row[1], 'placa': row[2], 'motorista': row[3], 'tipo': row[4],
                        'oc': row[5], 'valor': row[6], 'pix': row[7], 'favorecido': row[8], 'local': row[9],
                        'defeito': row[10]} for row in c.fetchall()]
        conn.close()
        
        return jsonify(manutencoes)
    except Exception as e:
        return jsonify({'error': f'Erro ao gerar relatório: {str(e)}'}), 500

@app.route('/api/exportar_excel', methods=['GET'])
def exportar_excel():
    try:
        conn = sqlite3.connect('manutencoes.db')
        query = 'SELECT * FROM manutencoes'
        df = pd.read_sql_query(query, conn)
        conn.close()

        output = BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='Manutencoes', index=False)
        output.seek(0)
        
        excel_data = base64.b64encode(output.getvalue()).decode('utf-8')
        return jsonify({'excel_data': excel_data})
    except Exception as e:
        return jsonify({'error': f'Erro ao exportar Excel: {str(e)}'}), 500

@app.route('/api/importar_excel', methods=['POST'])
def importar_excel():
    try:
        file_data = request.json.get('file_data')
        if not file_data:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400

        file_content = base64.b64decode(file_data.split(',')[1])
        df = pd.read_excel(BytesIO(file_content))
        
        required_columns = ['data', 'placa', 'motorista', 'tipo', 'valor', 'local', 'defeito']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return jsonify({'error': f'Colunas obrigatórias ausentes: {", ".join(missing_columns)}'}), 400

        errors = []
        for index, row in df.iterrows():
            if not validate_date(str(row['data'])):
                errors.append(f'Linha {index + 2}: Formato de data inválido. Use YYYY-MM-DD.')
            if not isinstance(row['valor'], (int, float)) or row['valor'] < 0:
                errors.append(f'Linha {index + 2}: Valor deve ser um número válido maior ou igual a zero.')
            if not all(row[col] and str(row[col]).strip() for col in required_columns):
                errors.append(f'Linha {index + 2}: Campos obrigatórios vazios.')

        if errors:
            return jsonify({'error': '\n'.join(errors)}), 400

        conn = sqlite3.connect('manutencoes.db')
        c = conn.cursor()
        
        for _, row in df.iterrows():
            c.execute('''INSERT INTO manutencoes (data, placa, motorista, tipo, oc, valor, pix, favorecido, local, defeito)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                     (str(row['data']), str(row['placa']).upper(), str(row['motorista']), str(row['tipo']), str(row.get('oc', '')),
                      float(row['valor']), str(row.get('pix', '')), str(row.get('favorecido', '')), str(row['local']), str(row['defeito'])))
        
        conn.commit()
        conn.close()
        return jsonify({'message': f'Dados importados com sucesso. {len(df)} registros adicionados.'}), 200
    except Exception as e:
        return jsonify({'error': f'Erro ao importar Excel: {str(e)}'}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)