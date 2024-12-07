// Открытие модального окна "New Employee"
document.getElementById('open-modal-btn').addEventListener('click', () => {
    const modal = document.getElementById('employee-modal');
    modal.style.display = 'block';
});

// Закрытие модального окна при клике на кнопку Cancel
document.querySelector('.cancel-btn').addEventListener('click', () => {
    const modal = document.getElementById('employee-modal');
    modal.style.display = 'none';
});

// Закрытие модального окна при клике на область вне его
window.addEventListener('click', (event) => {
    const modal = document.getElementById('employee-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
// Открытие модального окна "Edit Employee"
function openEditModal(employee) {
    const modal = document.getElementById('edit-employee-modal');

    // Заполняем поля формы данными сотрудника
    document.getElementById('employee-id').value = employee.id;
    document.getElementById('edit-full_name').value = employee.full_name;
    document.getElementById('edit-nie').value = employee.nie;
    document.getElementById('edit-start_date').value = employee.start_date || '';
    document.getElementById('edit-end_date').value = employee.end_date || '';
    document.getElementById('edit-work_start_time').value = employee.work_start_time || '';
    document.getElementById('edit-work_end_time').value = employee.work_end_time || '';
    document.getElementById('edit-days_per_week').value = employee.days_per_week || '';
    document.getElementById('edit-position').value = employee.position || '';
    document.getElementById('edit-section').value = employee.section || '';
    document.getElementById('edit-phone').value = employee.phone || '';
    document.getElementById('edit-email').value = employee.email || '';

    modal.style.display = 'block';
}

// Закрытие модального окна "Edit Employee"
document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    const modal = document.getElementById('edit-employee-modal');
    modal.style.display = 'none';
});

// Закрытие окна при клике на крестик
document.getElementById('close-edit-modal').addEventListener('click', () => {
    const modal = document.getElementById('edit-employee-modal');
    modal.style.display = 'none';
});

// Закрытие окна при клике за пределами окна
window.addEventListener('click', (event) => {
    const modal = document.getElementById('edit-employee-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
// Select the edit form
const editForm = document.getElementById('edit-employee-form');

if (editForm) {
    editForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Предотвращаем отправку формы по умолчанию

        if (!selectedEmployeeId) {
            console.error("ID сотрудника не выбран.");
            return;
        }

        // Отправка данных формы на сервер
        fetch(`/edit/${selectedEmployeeId}`, {
            method: 'POST',
            body: new FormData(editForm)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    console.log('Employee updated successfully');
                    alert('Employee updated successfully');
                    // Закрытие модального окна
                    editModal.style.display = 'none';
                    // Перезагрузка страницы или обновление данных на странице
                    location.reload();
                } else if (data.error) {
                    console.error('Error:', data.error);
                    alert(`Error: ${data.error}`);
                }
            })
            .catch(error => {
                console.error('Error updating employee:', error);
                alert('Failed to update employee. Please try again.');
            });
    });
} else {
    console.error("Edit form not found in the DOM.");
}
