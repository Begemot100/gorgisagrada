// Фильтр по группе (Sala, Cocina, Todos)
function applyGroupFilter(group) {
    const allEmployees = document.querySelectorAll('.employee-log');
    allEmployees.forEach(employee => {
        const section = employee.getAttribute('data-group');
        if (group === 'All' || section === group) {
            employee.style.display = 'block';
        } else {
            employee.style.display = 'none';
        }
    });
}

// Сброс всех фильтров
function resetFilter() {
    const allEmployees = document.querySelectorAll('.employee-log');
    allEmployees.forEach(employee => {
        employee.style.display = 'block';
    });
    document.getElementById('filterButton').textContent = 'Hoy';
}

// Открытие модального окна редактирования времени
function openEditModal(logId) {
    const modal = document.getElementById('editTimeModalContainer');
    modal.style.display = 'block';

    fetch(`/get_log_details/${logId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('edit-check-in-time').value = data.check_in_time || '';
            document.getElementById('edit-check-out-time').value = data.check_out_time || '';
        })
        .catch(error => {
            console.error('Error fetching log details:', error);
            alert('Ошибка загрузки данных.');
        });

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Сохранение изменений времени
function saveEditTime(logId) {
    const checkInTime = document.getElementById('edit-check-in-time').value;
    const checkOutTime = document.getElementById('edit-check-out-time').value;

    fetch(`/edit_log/${logId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ check_in_time: checkInTime, check_out_time: checkOutTime })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Изменения сохранены.');
                location.reload();
            } else {
                alert('Ошибка сохранения.');
            }
        })
        .catch(error => {
            console.error('Error saving log:', error);
            alert('Ошибка при сохранении данных.');
        });
}

// Применение фильтра по дате
function applyFilterByDate(selectedDate) {
    const rows = document.querySelectorAll('.log-row');
    rows.forEach(row => {
        const logDate = row.getAttribute('data-log-date');
        if (logDate === selectedDate) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// Применение пользовательского диапазона дат
function applyCustomRange() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Пожалуйста, выберите диапазон дат.');
        return;
    }

    const rows = document.querySelectorAll('.log-row');
    rows.forEach(row => {
        const logDate = row.getAttribute('data-log-date');
        if (logDate >= startDate && logDate <= endDate) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// Обновление статуса отпуска
function updateHolidayStatus(logId, status) {
    fetch(`/update_holiday_status/${logId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Статус обновлен.');
            } else {
                alert('Ошибка обновления статуса.');
            }
        })
        .catch(error => {
            console.error('Error updating status:', error);
            alert('Ошибка обновления статуса.');
        });
}

// Селекторы "выбрать все"
function selectAllEmployees() {
    const checkboxes = document.querySelectorAll('.checkbox-input');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

// Сброс выбора всех сотрудников
function deselectAllEmployees() {
    const checkboxes = document.querySelectorAll('.checkbox-input');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

// Экспорт данных в Excel
function exportExcel() {
    fetch('/export_to_excel')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'work_logs.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            console.error('Error exporting to Excel:', error);
            alert('Ошибка экспорта в Excel.');
        });
}

// Модальное окно "Новый график"
function openNewScheduleModal() {
    const modal = document.getElementById('newscheduleModal');
    modal.style.display = 'block';

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Закрытие модальных окон
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Инициализация
//document.addEventListener('DOMContentLoaded', () => {
//    document.getElementById('filterButton').addEventListener('click', resetFilter);
//    document.getElementById('customRangePicker').addEventListener('click', applyCustomRange);
//});

document.addEventListener('DOMContentLoaded', function () {
    // Select all dropdown elements with the name "holiday_type"
    const dayTypeSelects = document.querySelectorAll('select[name="holiday_type"]');

    // Function to update the background color
    function updateDayTypeBackground(selectElement) {
        // Log for debugging to ensure the function is called
        console.log('Updating background for:', selectElement.value);

        switch (selectElement.value) {
            case 'paid':
                selectElement.style.backgroundColor = '#FEDB5B'; // Yellow
                selectElement.style.color = '#000000'; // Black text
                break;
            case 'unpaid':
                selectElement.style.backgroundColor = '#DD8137'; // Orange
                selectElement.style.color = '#FFFFFF'; // White text
                break;
            case 'weekend':
                selectElement.style.backgroundColor = '#A6A6A6'; // Gray
                selectElement.style.color = '#FFFFFF'; // White text
                break;
            default:
                selectElement.style.backgroundColor = ''; // Reset to default
                selectElement.style.color = ''; // Reset to default
        }
    }

    // Initialize the background on page load
    dayTypeSelects.forEach(select => {
        // Apply initial background
        updateDayTypeBackground(select);

        // Listen for changes and update the background
        select.addEventListener('change', function () {
            updateDayTypeBackground(select);
        });
    });

    // Debugging: Log if no select elements are found
    if (dayTypeSelects.length === 0) {
        console.error('No select elements found with name "holiday_type".');
    }
});
//function toggleDropdown() {
//    const dropdownMenu = document.getElementById('dropdown-menu');
//    if (dropdownMenu) {
//        dropdownMenu.classList.toggle('hidden'); // Показывает/скрывает меню
//        console.log("Dropdown toggled.");
//    } else {
//        console.error("Dropdown menu not found.");
//    }
//}

// Отслеживаем, выбраны ли все чекбоксы
let randomState = false; // Отслеживает текущее состояние чекбоксов

function applyRandomSchedule() {
    const checkInStart = document.getElementById('checkInStart').value;
    const checkInEnd = document.getElementById('checkInEnd').value;
    const checkOutStart = document.getElementById('checkOutStart').value;
    const checkOutEnd = document.getElementById('checkOutEnd').value;

    if (!checkInStart || !checkInEnd || !checkOutStart || !checkOutEnd) {
        alert("Заполните все диапазоны времени!");
        return;
    }

    const selectedWorkLogs = document.querySelectorAll('.date-checkbox:checked');

    if (selectedWorkLogs.length === 0) {
        alert("Выберите ворклоги для применения расписания.");
        return;
    }

    selectedWorkLogs.forEach((checkbox) => {
        const logRow = checkbox.closest('tr');
        const checkInTime = logRow.querySelector('.check-in-time');
        const checkOutTime = logRow.querySelector('.check-out-time');

        const randomCheckIn = getRandomTime(checkInStart, checkInEnd);
        const randomCheckOut = getRandomTime(checkOutStart, checkOutEnd);

        if (checkInTime) checkInTime.textContent = randomCheckIn;
        if (checkOutTime) checkOutTime.textContent = randomCheckOut;

        // Отправка изменений на сервер (опционально)
        const logId = checkbox.id.replace('log-', '');
        fetch(`/update_log_time/${logId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                check_in_time: randomCheckIn,
                check_out_time: randomCheckOut,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(`Ворклог ${logId} обновлён.`);
                } else {
                    console.error(`Ошибка обновления ворклога ${logId}.`);
                }
            })
            .catch((error) => console.error('Ошибка при обновлении ворклога:', error));
    });

    // Закрытие модального окна после применения
    closeNewScheduleModal();
    alert("Расписание успешно применено!");
}

// Генерация случайного времени в заданном диапазоне
function getRandomTime(start, end) {
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);

    const startTime = startHours * 60 + startMinutes;
    const endTime = endHours * 60 + endMinutes;

    const randomTime = Math.floor(Math.random() * (endTime - startTime + 1)) + startTime;

    const randomHours = Math.floor(randomTime / 60).toString().padStart(2, '0');
    const randomMinutes = (randomTime % 60).toString().padStart(2, '0');

    return `${randomHours}:${randomMinutes}`;
}
fetch(`/update_log_time/${logId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        check_in_time: randomCheckIn,
        check_out_time: randomCheckOut,
    }),
})
