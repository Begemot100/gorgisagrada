from urllib.parse import quote
import math
from datetime import datetime, date, timedelta, time as dt_time
import time
from io import BytesIO
import pandas as pd
from flask import Flask, render_template, request, redirect, url_for, jsonify, session, send_file, make_response
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import extract, func
# from openpyxl.utils import get_column_letter
# from models import Employee, WorkLog
import logging
from collections import defaultdict
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import hashlib

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

# Настройка базы данных: используем DATABASE_URL, если доступно, или SQLite для локальной разработки
# db_url = os.getenv('DATABASE_URL')
# if db_url and db_url.startswith("postgres://"):
#     db_url = db_url.replace("postgres://", "postgresql://", 1)
# app.config['SQLALCHEMY_DATABASE_URI'] = db_url or f"sqlite:///{os.path.join(os.getcwd(), 'instance', 'employees.db')}"
#
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.secret_key = '6006'
# app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=4)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////Users/germany/Desktop/sagrada/pythonProject1/instance/employees.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

with app.app_context():
    db.create_all()  # Создайте таблицы, если их еще нет


# Инициализация базы данных и миграций
# db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)


    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class DashboardUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # Проверьте, что это поле существует


    def set_password(self, password):
        self.password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()

    def check_password(self, password):
        return self.password_hash == hashlib.sha256(password.encode('utf-8')).hexdigest()

# Модель для сотрудников
class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    nie = db.Column(db.String(20), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    # hours_per_week = db.Column(db.Integer, nullable=False)
    days_per_week = db.Column(db.Integer, nullable=False)
    position = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    section = db.Column(db.String(50), nullable=False)
    check_in_time = db.Column(db.DateTime, nullable=True)
    check_out_time = db.Column(db.DateTime, nullable=True)
    daily_hours = db.Column(db.Float, default=0)
    monthly_hours = db.Column(db.Float, default=0)
    work_start_time = db.Column(db.Time, nullable=False)
    work_end_time = db.Column(db.Time, nullable=False)
    total_hours = db.Column(db.Float, default=0)
    total_days = db.Column(db.Integer, default=0)
    paid_holidays = db.Column(db.Integer, default=0)
    unpaid_holidays = db.Column(db.Integer, default=0)

    work_logs = db.relationship('WorkLog', backref='employee', cascade="all, delete-orphan", lazy=True)

    def __repr__(self):
        return f'<Employee {self.full_name}>'

with app.app_context():
    db.create_all()
# Модель для записей рабочего времени
class WorkLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)
    check_in_time = db.Column(db.DateTime, nullable=True)
    check_out_time = db.Column(db.DateTime, nullable=True)
    worked_hours = db.Column(db.Float, default=0)
    log_date = db.Column(db.Date, nullable=False)
    holidays = db.Column(db.String(50), default='Working day')
    # work_log = db.session.get(WorkLog, id)
    def calculate_worked_hours(self):
        if self.check_in_time and self.check_out_time:
            time_diff = self.check_out_time - self.check_in_time
            return time_diff.total_seconds() / 3600  # Возвращаем количество часов
        return 0

@app.route('/')
def home():
    return render_template('home.html')

# @app.route('/login')
# def index():
#     return render_template('index.html')


@app.route('/add', methods=['POST'])
def add_employee():
    nie = request.form.get('nie')

    # Проверка дублирующего сотрудника
    existing_employee = Employee.query.filter_by(nie=nie).first()
    if existing_employee:
        return jsonify({'error': 'Employee with this NIE already exists'}), 400

    # Сбор остальных данных
    full_name = request.form.get('full_name')
    position = request.form.get('position')
    phone = request.form.get('phone')
    email = request.form.get('email')
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    section = request.form.get('section')
    nie = request.form.get('nie')
    work_start_time = request.form.get('work_start_time')
    work_end_time = request.form.get('work_end_time')

    try:
        # Преобразуем даты и время
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date() if start_date else None
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date() if end_date else None
        work_start_time = datetime.strptime(work_start_time, '%H:%M').time() if work_start_time else None
        work_end_time = datetime.strptime(work_end_time, '%H:%M').time() if work_end_time else None
    except ValueError:
        return jsonify({'error': 'Invalid date or time format'}), 400

    # Создаем сотрудника
    new_employee = Employee(
        full_name=full_name,
        nie=nie,
        position=position,
        phone=phone,
        email=email,
        start_date=start_date,
        end_date=end_date,
        section=section,
        work_start_time=work_start_time,
        work_end_time=work_end_time,
    )

    # Сохраняем в базу
    db.session.add(new_employee)
    db.session.commit()

    return jsonify({'message': 'Employee added successfully!'})


# Удаление сотрудника
@app.route('/delete/<int:employee_id>', methods=['POST'])
def delete_employee(employee_id):
    employee = Employee.query.get(employee_id)
    if employee:
        db.session.delete(employee)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False}), 404

# Редактирование сотрудника
@app.route('/edit/<int:id>', methods=['POST'])
def edit_employee(id):
    employee = db.session.get(Employee, id)
    if not employee:
        return jsonify({'error': 'Empleado no encontrado'}), 404

    try:
        # Основные данные сотрудника
        employee.full_name = request.form['full_name']
        employee.nie = request.form['nie']
        employee.phone = request.form['phone']
        employee.position = request.form['position']
        employee.email = request.form['email']
        employee.section = request.form['section']
        employee.days_per_week = int(request.form['days_per_week'])

        # Обработка дат начала и окончания контракта
        start_date_str = request.form.get('start_date')
        end_date_str = request.form.get('end_date')
        if start_date_str:
            employee.start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        if end_date_str:
            employee.end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        else:
            employee.end_date = None

        # Обработка рабочего диапазона времени
        work_start_time_str = request.form.get('work_start_time')
        work_end_time_str = request.form.get('work_end_time')

        if not work_start_time_str or not work_end_time_str:
            logging.error("Не указаны рабочие часы для редактирования.")
            return jsonify({'error': 'No se han especificado las horas de trabajo'}), 400

        # Парсинг времени начала и окончания работы
        employee.work_start_time = datetime.strptime(work_start_time_str, '%H:%M').time()
        employee.work_end_time = datetime.strptime(work_end_time_str, '%H:%M').time()

        # Сохранение изменений
        try:
            logging.info("Попытка сохранения данных в базу...")
            db.session.commit()
            logging.info("Данные успешно сохранены в базу.")
        except Exception as e:
            logging.error(f"Ошибка при сохранении данных: {e}")
            db.session.rollback()
            logging.info("Откат транзакции выполнен.")
        logging.info(f"Сотрудник {employee.full_name} успешно обновлен.")
        return jsonify({'message': '¡Empleado actualizado con éxito!'}), 200

    except ValueError as e:
        logging.error(f"Ошибка при парсинге данных: {e}")
        return jsonify({'error': 'Formato de datos incorrecto'}), 400
    except Exception as e:
        logging.error(f"Ошибка при обновлении данных сотрудника: {e}")
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar al empleado'}), 500


@app.route('/login')
def dashboard():
    employees = Employee.query.all()  # Получение всех сотрудников
    logging.info(f"Fetched employees: {[employee.full_name for employee in employees]}")
    return render_template('index.html', employees=employees)

@app.route('/check_employees', methods=['GET'])
def check_employees():
    employees = Employee.query.all()
    return jsonify([{
        "full_name": e.full_name,
        "nie": e.nie,
        "start_date": e.start_date.isoformat() if e.start_date else None,
        "end_date": e.end_date.isoformat() if e.end_date else None,
        "work_start_time": e.work_start_time.strftime('%H:%M') if e.work_start_time else None,
        "work_end_time": e.work_end_time.strftime('%H:%M') if e.work_end_time else None,
        "days_per_week": e.days_per_week,
        "position": e.position,
        "phone": e.phone,
        "email": e.email,
        "section": e.section
    } for e in employees])

@app.route('/employee/<int:employee_id>', methods=['GET'])
def get_employee(employee_id):
    employee = Employee.query.get(employee_id)
    if employee:
        return jsonify({
            'id': employee.id,
            'full_name': employee.full_name,
            'position': employee.position,
            'phone': employee.phone,
            'email': employee.email,
            'nie': employee.nie,
            'start_date': employee.start_date.isoformat() if employee.start_date else '',
            'end_date': employee.end_date.isoformat() if employee.end_date else '',
            'work_start_time': employee.work_start_time.strftime('%H:%M') if employee.work_start_time else '',
            'work_end_time': employee.work_end_time.strftime('%H:%M') if employee.work_end_time else '',
            'days_per_week': employee.days_per_week,
            'section': employee.section
        })
    return jsonify({'error': 'Employee not found'}), 404

@app.route('/check_in/<int:employee_id>', methods=['POST'])
def check_in(employee_id):
    try:
        current_date = date.today()

        # Проверяем наличие записи work_log для сотрудника за сегодня
        work_log = WorkLog.query.filter_by(employee_id=employee_id, log_date=current_date).first()

        if work_log and work_log.check_in_time:
            return jsonify({"error": "Already checked in for today"}), 400

        if not work_log:
            # Создаём новую запись work_log
            work_log = WorkLog(
                employee_id=employee_id,
                log_date=current_date,
                check_in_time=datetime.now()
            )
            db.session.add(work_log)
        else:
            # Обновляем check_in_time для существующей записи
            work_log.check_in_time = datetime.now()

        db.session.commit()
        logging.info(f"Check-in successful for employee_id={employee_id}, time={work_log.check_in_time}")

        return jsonify({"check_in_time": work_log.check_in_time.strftime('%H:%M')}), 200

    except Exception as e:
        logging.error(f"Error during check-in: {e}")
        return jsonify({"error": "Server error. Please try again later."}), 500

@app.route('/check_out/<int:employee_id>', methods=['POST'])
def check_out(employee_id):
    try:
        current_date = date.today()

        # Проверяем запись work_log для сотрудника за сегодня
        work_log = WorkLog.query.filter_by(employee_id=employee_id, log_date=current_date).first()

        if not work_log or not work_log.check_in_time:
            return jsonify({"error": "Cannot check out before checking in"}), 400

        if work_log.check_out_time:
            return jsonify({"error": "Already checked out for today"}), 400

        # Устанавливаем время check_out и рассчитываем отработанные часы
        work_log.check_out_time = datetime.now()
        work_log.worked_hours = work_log.calculate_worked_hours()

        db.session.commit()
        logging.info(f"Check-out successful for employee_id={employee_id}, time={work_log.check_out_time}")

        return jsonify({
            "check_out_time": work_log.check_out_time.strftime('%H:%M'),
            "daily_hours": work_log.worked_hours
        }), 200

    except Exception as e:
        logging.error(f"Error during check-out: {e}")
        return jsonify({"error": "Server error. Please try again later."}), 500

def reset_logs():
    try:
        current_date = datetime.now().date()

        # Добавляем новые записи за новый день
        employees = Employee.query.all()

        for employee in employees:
            # Проверяем существующую запись
            existing_log = WorkLog.query.filter_by(employee_id=employee.id, log_date=current_date).first()

            if not existing_log:
                new_log = WorkLog(
                    employee_id=employee.id,
                    log_date=current_date
                )
                db.session.add(new_log)

        db.session.commit()
        logging.info("Logs reset for the new day.")

    except Exception as e:
        logging.error(f"Error resetting logs: {e}")


scheduler = BackgroundScheduler()
scheduler.add_job(func=reset_logs, trigger='cron', hour=0, minute=0)
scheduler.start()


def calculate_hours(check_in, check_out):
    try:
        check_in_time = datetime.strptime(check_in, '%H:%M:%S')
        check_out_time = datetime.strptime(check_out, '%H:%M:%S')
        total_seconds = (check_out_time - check_in_time).seconds
        return round(total_seconds / 3600, 2)
    except Exception as e:
        print(f"Error in calculate_hours: {e}")
        return 0.0


@app.route('/board')
def board():
    employees = Employee.query.all()  # Получаем всех сотрудников
    dashboard_data = []
    today = date.today()

    for employee in employees:
        # Проверяем, есть ли запись в work_log для текущего дня
        work_log = WorkLog.query.filter_by(employee_id=employee.id, log_date=today).first()

        if not work_log:
            # Если записи нет, создаём новую запись с дефолтными значениями
            work_log = WorkLog(
                employee_id=employee.id,
                log_date=today,
                check_in_time=None,
                check_out_time=None,
                worked_hours=0.0
            )
            db.session.add(work_log)
            db.session.commit()  # Сохраняем изменения в базе

        # Устанавливаем значения для отображения
        dashboard_data.append({
            'employee': employee,
            'check_in_time': work_log.check_in_time.strftime('%H:%M') if work_log.check_in_time else '--:--',
            'check_out_time': work_log.check_out_time.strftime('%H:%M') if work_log.check_out_time else '--:--',
            'daily_hours': work_log.worked_hours if work_log.worked_hours else 0.0
        })

    return render_template('board.html', dashboard_data=dashboard_data, current_date=today)



if __name__ == '__main__':

    # Запускаем Flask сервер
    app.run(debug=True, port=5003)