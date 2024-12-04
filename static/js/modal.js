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
                    left = rect.left - modalWidth - 10; // Смещаем налево, если вылазит за экран
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
