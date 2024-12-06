document.addEventListener('DOMContentLoaded', function () {
    // Модальное окно "New Employee"
    const newEmployeeModal = document.getElementById('employee-modal');
    const openNewEmployeeModalBtn = document.getElementById('open-modal-btn');
    const newEmployeeForm = document.getElementById('employee-form');
    const cancelNewEmployeeModalBtn = newEmployeeModal?.querySelector('.cancel-btn');

    if (newEmployeeModal && openNewEmployeeModalBtn && cancelNewEmployeeModalBtn) {
        openNewEmployeeModalBtn.addEventListener('click', () => {
            newEmployeeModal.style.display = 'block';
        });

        cancelNewEmployeeModalBtn.addEventListener('click', () => {
            newEmployeeModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === newEmployeeModal) {
                newEmployeeModal.style.display = 'none';
            }
        });

        newEmployeeForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Отключаем стандартное поведение формы

            fetch(newEmployeeForm.action, {
                method: 'POST',
                body: new FormData(newEmployeeForm)
            })
                .then(response => {
                    if (response.ok) {
                        newEmployeeModal.style.display = 'none';
                        newEmployeeForm.reset(); // Сбрасываем поля формы
                        alert('Employee added successfully!');
                        location.reload(); // Перезагружаем страницу
                    } else {
                        alert('Failed to add employee. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error adding employee:', error);
                    alert('An error occurred. Please try again.');
                });
        });
    } else {
        console.error("New Employee Modal elements not found.");
    }

    // Модальное окно "Edit Employee"
    const editEmployeeModal = document.getElementById('edit-employee-modal');
    const closeEditEmployeeModalBtn = document.getElementById('close-edit-modal');
    const cancelEditEmployeeModalBtn = document.getElementById('cancel-edit-btn');

    function openEditModal(employee) {
        if (!editEmployeeModal) {
            console.error('Edit Employee Modal not found in DOM');
            return;
        }

        // Заполняем поля формы данными сотрудника
        document.getElementById('employee-id').value = employee.id || '';
        document.getElementById('edit-full-name').value = employee.full_name || '';
        document.getElementById('edit-nie').value = employee.nie || '';
        document.getElementById('edit-start-date').value = employee.start_date || '';
        document.getElementById('edit-end-date').value = employee.end_date || '';
        document.getElementById('edit-work-start-time').value = employee.work_start_time || '';
        document.getElementById('edit-work-end-time').value = employee.work_end_time || '';
        document.getElementById('edit-days-per-week').value = employee.days_per_week || '';
        document.getElementById('edit-position').value = employee.position || '';
        document.getElementById('edit-section').value = employee.section || '';
        document.getElementById('edit-phone').value = employee.phone || '';
        document.getElementById('edit-email').value = employee.email || '';

        editEmployeeModal.style.display = 'block';
    }

    if (closeEditEmployeeModalBtn && cancelEditEmployeeModalBtn) {
        closeEditEmployeeModalBtn.addEventListener('click', () => {
            editEmployeeModal.style.display = 'none';
        });

        cancelEditEmployeeModalBtn.addEventListener('click', () => {
            editEmployeeModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === editEmployeeModal) {
                editEmployeeModal.style.display = 'none';
            }
        });
    } else {
        console.error("Edit Employee Modal elements not found.");
    }

    // Модальное окно "Options" (троеточие)
    const optionsModal = document.getElementById('options-modal');
    const optionsButtons = document.querySelectorAll('.options-btn');
    const editBtn = document.getElementById('edit-btn');
    const deleteBtn = document.getElementById('delete-btn');

    if (optionsModal && editBtn && deleteBtn && optionsButtons.length) {
        optionsButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const rect = button.getBoundingClientRect();
                const modalWidth = optionsModal.offsetWidth;
                const modalHeight = optionsModal.offsetHeight;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                let top = rect.top + window.scrollY;
                let left = rect.right + 10;

                if (left + modalWidth > viewportWidth) {
                    left = rect.left - modalWidth - 30; // Смещаем налево, если вылазит за экран
                }

                if (top + modalHeight > viewportHeight) {
                    top = viewportHeight - modalHeight - 10; // Смещаем вверх, если выходит за низ
                }

                optionsModal.style.top = `${top}px`;
                optionsModal.style.left = `${left}px`;
                optionsModal.dataset.employeeId = button.dataset.id;
                optionsModal.classList.add('show');
            });
        });

        document.addEventListener('click', (event) => {
            if (!optionsModal.contains(event.target) && !event.target.classList.contains('options-btn')) {
                optionsModal.classList.remove('show');
            }
        });

       // Кнопка "Editar"
        editBtn.addEventListener('click', () => {
            const employeeId = optionsModal.dataset.employeeId;

            fetch(`/employee/${employeeId}`)
                .then(response => response.json())
                .then(employee => {
                    openEditModal(employee); // Открываем модальное окно с данными сотрудника
                    optionsModal.classList.remove('show'); // Закрываем окно с опциями
                })
                .catch(error => console.error('Error fetching employee:', error));
        });

        // Обработчик отправки формы для редактирования
        const editForm = document.getElementById('edit-employee-form');
        editForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Отключаем стандартную отправку формы

            const employeeId = document.getElementById('employee-id').value;

            fetch(`/edit/${employeeId}`, {
                method: 'POST',
                body: new FormData(editForm),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert('Employee updated successfully!');
                        location.reload(); // Обновляем страницу
                    } else if (data.error) {
                        alert(`Error: ${data.error}`);
                    }
                })
                .catch(error => console.error('Error updating employee:', error));
        });


        // Кнопка "Eliminar"
        deleteBtn.addEventListener('click', () => {
            const employeeId = optionsModal.dataset.employeeId;
            if (confirm('Are you sure you want to delete this employee?')) {
                fetch(`/delete/${employeeId}`, { method: 'POST' })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('Employee deleted successfully');
                            location.reload();
                        } else {
                            alert('Failed to delete employee');
                        }
                    })
                    .catch(error => console.error('Error deleting employee:', error));
            }
            optionsModal.classList.remove('show');
        });
    } else {
        console.error("Options Modal elements or buttons not found.");
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const employeeCards = document.querySelectorAll('.employee-card');

    if (filterButtons && employeeCards) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                const filter = button.getAttribute('data-filter');

                // Убираем активный класс у всех кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Фильтруем сотрудников
                employeeCards.forEach(employee => {
                    const section = employee.getAttribute('data-section').toLowerCase(); // Приводим к нижнему регистру
                    if (filter === 'all' || section === filter) {
                        employee.style.display = 'flex'; // Показываем сотрудника
                    } else {
                        employee.style.display = 'none'; // Скрываем сотрудника
                    }
                });
            });
        });
    } else {
        console.error('Filter buttons or employee cards not found.');
    }
});
document.getElementById('export-excel-admin-btn').addEventListener('click', () => {
    // Collect IDs of displayed employees with the "data-id" attribute
    const selectedEmployees = Array.from(document.querySelectorAll('.employee-card')).filter(card => {
        // Check if the card is visible based on filters
        const isVisible = card.style.display !== 'none';
        return isVisible; // Only include visible cards
    }).map(card => {
        const employeeId = card.getAttribute('data-id'); // Get the employee ID
        return employeeId;
    });

    // Filter out null or undefined IDs
    const validEmployeeIds = selectedEmployees.filter(id => id);

    if (validEmployeeIds.length === 0) {
        alert('No employees selected for export.');
        return;
    }

    // Send the request to the backend
    fetch('/export_employees_excel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeIds: validEmployeeIds }),
    })
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || 'Failed to export Excel file.');
                });
            }
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'filtered_employees_data.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            alert(error.message);
            console.error('Export Excel Error:', error);
        });
});
//function openFilterModal() {
//    const hoyButton = document.getElementById('hoyButton');
//    const filterModal = document.getElementById('filterModal');
//
//    // Определяем позицию кнопки Hoy
//    const rect = hoyButton.getBoundingClientRect();
//
//    // Устанавливаем координаты модального окна под кнопкой Hoy
//    filterModal.style.top = `${rect.bottom + window.scrollY + 5}px`; // Немного отступаем от нижней границы
//    filterModal.style.left = `${rect.left + window.scrollX}px`;
//
//    // Показываем модальное окно
//    filterModal.style.display = 'block';
//}
//
//function closeFilterModal() {
//    const filterModal = document.getElementById('filterModal');
//    filterModal.style.display = 'none';
//}
//
//function applyFilter(filter) {
//    console.log(`Filter applied: ${filter}`);
//    closeFilterModal();
//}
//
//function applyCustomRange() {
//    console.log('Custom range selected');
//}
//function toggleFilterModal(button) {
//    const filterModal = document.getElementById('filterModal');
//
//    // Позиционирование модального окна под кнопкой
//    const rect = button.getBoundingClientRect();
//    filterModal.style.top = `${rect.bottom + window.scrollY}px`;
//    filterModal.style.left = `${rect.left + window.scrollX}px`;
//
//    // Показ/скрытие модального окна
//    filterModal.classList.toggle('hidden');
//}

function applyFilter(filterType) {
    const filterButton = document.getElementById('filterButton');
    let filterText = '';

    // Определение текста для каждого фильтра
    switch (filterType) {
        case 'today':
            filterText = 'Hoy';
            break;
        case 'yesterday':
            filterText = 'Ayer';
            break;
        case 'last7days':
            filterText = 'Últimos 7 días';
            break;
        case 'last30days':
            filterText = 'Últimos 30 días';
            break;
        case 'thismonth':
            filterText = 'Este mes';
            break;
        case 'lastmonth':
            filterText = 'Mes Anterior';
            break;
        default:
            filterText = 'Rango Personalizado';
    }

    // Обновление текста кнопки
    filterButton.textContent = filterText;

    // Логика для применения фильтра
    console.log(`Filter applied: ${filterType}`);

    // Закрытие модального окна
    closeFilterModal();
}

function closeFilterModal() {
    const filterModal = document.getElementById('filterModal');
    filterModal.classList.add('hidden');
}

function applyCustomRange() {
    const customRangeInputs = document.getElementById('customRangeInputs');
    customRangeInputs.style.display = 'block';
}

function applyCustomDateRange() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Обновление текста кнопки на основе диапазона
    const filterButton = document.getElementById('filterButton');
    filterButton.textContent = `${startDate} - ${endDate}`;

    console.log(`Custom range applied: ${startDate} to ${endDate}`);

    // Скрытие модального окна
    closeFilterModal();
}

document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-btn');
    if (editButton) {
        console.log('Кнопка "Editar" найдена');
        editButton.addEventListener('click', handleEditClick);
    } else {
        console.error('Кнопка "Editar" не найдена');
    }
});

document.getElementById('edit-btn').addEventListener('click', () => {
    const selectedEmployees = Array.from(document.querySelectorAll('.employee-checkbox:checked'));

    if (selectedEmployees.length === 0) {
        alert('Выберите хотя бы одного сотрудника.');
        return;
    }

    selectedEmployees.forEach(checkbox => {
        const employeeId = checkbox.id.replace('employee_', '');
        const logsContainer = document.querySelector(`#logs-container-${employeeId}`);
        const logCheckboxes = logsContainer.querySelectorAll('.checkbox-cell');

        logCheckboxes.forEach(cell => cell.classList.remove('hidden')); // Показать чекбоксы
    });

    alert('Выберите запись для редактирования.');
});

document.addEventListener('change', (event) => {
    if (event.target.classList.contains('date-checkbox')) {
        const checkbox = event.target;

        if (checkbox.checked) {
            const logId = checkbox.id.replace('log-', ''); // Получаем ID лога
            openEditModal(logId); // Открываем модальное окно редактирования
        }
    }
});

function openEditModal(logId) {
    const modal = document.getElementById('editTimeModalContainer');
    modal.style.display = 'block';

    // Запрос на сервер для получения данных лога
    fetch(`/get_log_details/${logId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('edit-check-in-time').value = data.check_in_time || '';
            document.getElementById('edit-check-out-time').value = data.check_out_time || '';
        })
        .catch(error => {
            console.error('Ошибка получения данных лога:', error);
            alert('Не удалось загрузить данные.');
        });

    // Закрываем модальное окно при клике вне его
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-btn');
    if (editButton) {
        editButton.addEventListener('click', handleEditClick);
        console.log('Кнопка "Editar" подключена');
    } else {
        console.error('Кнопка "Editar" не найдена');
    }
});


function handleEditClick() {
    console.log('Кнопка "Editar" была нажата');

    // Найти выбранные чекбоксы сотрудников
    const selectedEmployees = Array.from(document.querySelectorAll('.employee-checkbox:checked'));
    if (selectedEmployees.length === 0) {
        alert('Выберите сотрудника для редактирования логов.');
        return;
    }

    // Показать чекбоксы для логов выбранных сотрудников
    selectedEmployees.forEach((checkbox) => {
        const employeeId = checkbox.id.replace('employee_', ''); // Получаем ID сотрудника
        const logsContainer = document.getElementById(`logs-container-${employeeId}`);
        const actionButtons = document.getElementById(`action-buttons-${employeeId}`);

        if (logsContainer && actionButtons) {
            const checkboxCells = logsContainer.querySelectorAll('.checkbox-cell');
            checkboxCells.forEach(cell => cell.classList.remove('hidden')); // Показываем чекбоксы
            actionButtons.classList.remove('hidden'); // Показываем кнопки действий
        } else {
            console.error(`Логи или кнопки для сотрудника с ID ${employeeId} не найдены`);
        }
    });

    alert('Теперь вы можете выбрать логи для редактирования.');
}



function saveEditTime() {
   const logId = document.querySelector('.date-checkbox:checked').id.replace('log-', '');
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
               updateWorkLogs(); // Обновляем данные на странице без перезагрузки
               closeModal(); // Закрываем модальное окно
           } else {
               alert('Ошибка сохранения.');
           }
       })
       .catch(error => {
           console.error('Ошибка при сохранении:', error);
           alert('Не удалось сохранить изменения.');
       });
}
document.addEventListener('DOMContentLoaded', () => {
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeBtn = editProfileModal.querySelector('.close-btn');
    const editProfileForm = document.getElementById('editProfileForm');

    // Open the modal when "Edit Profile" button is clicked
    editProfileBtn.addEventListener('click', () => {
        editProfileModal.style.display = 'block';
    });

    // Close the modal when the close button is clicked
    closeBtn.addEventListener('click', () => {
        editProfileModal.style.display = 'none';
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    });

    // Handle the form submission
    editProfileForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(editProfileForm);

        // Send the data to the server using fetch
        fetch('/update_profile', {
            method: 'POST',
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert('Profile updated successfully!');
                location.reload(); // Reload the page to reflect changes
            } else {
                alert('Error updating profile. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error updating profile:', error);
            alert('An error occurred. Please try again.');
        });
    });
});
