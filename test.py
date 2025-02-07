from flask import Flask, jsonify
from flask.json import JSONEncoder
from datetime import datetime, date, time

app = Flask(__name__)

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, time):  
            return obj.strftime('%H:%M') 
        if isinstance(obj, date):  
            return obj.isoformat()  
        return super().default(obj) 

app.json_encoder = CustomJSONEncoder

@app.route('/test')
def test():
    sample_data = {
        "start_time": time(9, 30),  
        "end_time": time(17, 45),  
        "today_date": date.today(),  
    }
    return jsonify(sample_data)  

if __name__ == '__main__':
    app.run(debug=True)
