from flask import render_template

import app
from app import Employee


@app.route('/work')
def work():
    employees = Employee.query.all()
    for employee in employees:
        print(employee.full_name)  # Отладка
        for log in employee.work_logs:
            print(log.log_date, log.check_in_time, log.check_out_time)

    return render_template('work.html', employees=employees)
