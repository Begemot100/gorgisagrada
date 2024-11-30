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
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('filterButton').addEventListener('click', resetFilter);
    document.getElementById('customRangePicker').addEventListener('click', applyCustomRange);
});

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

// Отслеживаем, выбраны ли все чекбоксы
let allSelected = false;

// Функция переключения всех чекбоксов
function toggleAllCheckboxes() {
    const checkboxes = document.querySelectorAll('.employee-checkbox'); // Ищем все чекбоксы
    console.log('Количество чекбоксов найдено:', checkboxes.length);

    // Переключаем состояние каждого чекбокса
    checkboxes.forEach((checkbox) => {
        checkbox.checked = !allSelected; // Меняем состояние чекбокса
        console.log('Состояние чекбокса:', checkbox.checked); // Логируем состояние
    });

    allSelected = !allSelected; // Меняем флаг
    console.log(allSelected ? 'Все выбраны' : 'Все сняты');
}

// Вешаем слушатель на кнопку "ChooseAll" после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    const chooseAllButton = document.getElementById('choose-all-btn');
    if (chooseAllButton) {
        chooseAllButton.addEventListener('click', toggleAllCheckboxes);
        console.log('Кнопка "ChooseAll" найдена, событие привязано');
    } else {
        console.error('Кнопка "ChooseAll" не найдена');
    }
});
