from flask import Flask, jsonify
from flask.json import JSONEncoder
from datetime import datetime, date, time

app = Flask(__name__)

# Кастомный JSONEncoder
class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, time):  # Если объект типа time
            return obj.strftime('%H:%M')  # Преобразуем в строку
        if isinstance(obj, date):  # Если объект типа date
            return obj.isoformat()  # Преобразуем в ISO 8601
        return super().default(obj)  # Для других типов используем стандартный обработчик

# Привязываем кастомный JSONEncoder к Flask
app.json_encoder = CustomJSONEncoder

# Тестовый маршрут для проверки
@app.route('/test')
def test():
    sample_data = {
        "start_time": time(9, 30),  # Объект времени
        "end_time": time(17, 45),  # Объект времени
        "today_date": date.today(),  # Объект даты
    }
    return jsonify(sample_data)  # Преобразуется автоматически кастомным JSONEncoder

if __name__ == '__main__':
    app.run(debug=True)
