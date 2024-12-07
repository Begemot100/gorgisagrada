// Flag for preventing multiple form submissions
let isSubmitting = false;

// Employee addition form submission logic
document.getElementById('employee-form').addEventListener('submit', function (event) {
    event.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions
    isSubmitting = true; // Set the flag

    const formData = new FormData(event.target);

    fetch('/add', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            isSubmitting = false; // Reset the flag
            if (data.employee) {
                // Create a new employee card
                const employeeList = document.getElementById('employee-list');
                const newCard = document.createElement('div');
                newCard.className = 'employee-card';
                newCard.innerHTML = `
                    <div class="employee-row">
                        <span>${data.employee.full_name}</span>
                        <span>${data.employee.nie}</span>
                        <span>${data.employee.position}</span>
                        <span>${data.employee.phone}</span>
                        <span>${data.employee.email}</span>
                        <span>${data.employee.start_date}</span>
                        <span>${data.employee.work_start_time}</span>
                        <span>${data.employee.work_end_time}</span>
                        <button class="options-btn" data-id="${data.employee.id}">...</button>
                    </div>
                `;
                employeeList.appendChild(newCard);

                // Reset the form
                event.target.reset();

                // Show success message
                alert(data.message);
            } else if (data.error) {
                alert(data.error); // Show error message
            }
        })
        .catch(error => {
            isSubmitting = false; // Reset the flag on error
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
});

// Selectors for modals and buttons
const optionsButtons = document.querySelectorAll('.options-btn');
const optionsModal = document.getElementById('options-modal');
const closeOptionsModal = document.getElementById('close-options-modal');
const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById('delete-btn');
const editModal = document.getElementById('edit-modal');

let selectedEmployeeId = null;

// Open the options modal
optionsButtons.forEach(button => {
    button.addEventListener('click', () => {
        console.log("Клик по кнопке троеточия");

        selectedEmployeeId = button.getAttribute('data-id');
        console.log("ID выбранного сотрудника:", selectedEmployeeId);
        console.log("Selected Employee ID:", selectedEmployeeId);


        if (!optionsModal) {
            console.error("Модальное окно не найдено!");
            return;
        }

        // Получаем координаты кнопки
        const rect = button.getBoundingClientRect();

        // Рассчитываем позицию модального окна
        let modalLeft = rect.left + window.scrollX - optionsModal.offsetWidth - 200; // Слева от кнопки с отступом
        const modalTop = rect.top + window.scrollY;

        // Проверяем ширину экрана и корректируем позицию, если окно выходит за границу
        if (modalLeft < 0) {
            modalLeft = rect.right + window.scrollX + 10; // Перемещаем окно справа от кнопки
        }
        // Устанавливаем позицию модального окна
        optionsModal.style.top = `${modalTop}px`;
        optionsModal.style.left = `${modalLeft}px`;
        optionsModal.style.display = 'block'; // Показываем модальное окно

        console.log("Модальное окно открыто в позиции:", { top: modalTop, left: modalLeft });
    });
});

// Close the options modal
closeOptionsModal.addEventListener('click', () => {
    optionsModal.style.display = 'none';
});



// Handle "Editar" button click
editBtn.addEventListener('click', () => {
    console.log("Закрытие модального окна");

    optionsModal.style.display = 'none';

    // Fetch employee data and open the edit modal
    fetch(`/employee/${selectedEmployeeId}`)
        .then(response => response.json())
        .then(employee => {
            document.getElementById('employee-id').value = employee.id;
            document.getElementById('edit-full-name').value = employee.full_name;
            document.getElementById('edit-position').value = employee.position;
            document.getElementById('edit-nie').value = employee.nie;
            document.getElementById('edit-phone').value = employee.phone;
            document.getElementById('edit-email').value = employee.email;
            document.getElementById('edit-start-date').value = employee.start_date || '';
            document.getElementById('edit-end-date').value = employee.end_date || '';
            document.getElementById('edit-work-start-time').value = employee.work_start_time || '';
            document.getElementById('edit-work-end-time').value = employee.work_end_time || '';
            document.getElementById('edit-days-per-week').value = employee.days_per_week || '';
            document.getElementById('edit-section').value = employee.section || '';

            editModal.style.display = 'flex';
        })
        .catch(error => {
            console.error('Error fetching employee data:', error);
            alert('Unable to load employee data.');
        });
});

// Handle "Eliminar" button click
deleteBtn.addEventListener('click', () => {
    optionsModal.style.display = 'none';
    if (confirm('Are you sure you want to delete this employee?')) {
        fetch(`/delete/${selectedEmployeeId}`, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Employee deleted successfully!');
                    // Remove the employee card
                    const employeeCard = document.querySelector(`.options-btn[data-id="${selectedEmployeeId}"]`).closest('.employee-card');
                    employeeCard.remove();
                } else {
                    alert('Error deleting employee!');
                }
            })
            .catch(error => {
                console.error('Error deleting employee:', error);
                alert('Failed to delete employee.');
            });
    }
});



// Close modals when clicking outside of them
window.addEventListener('click', (event) => {
    if (event.target === optionsModal) {
        optionsModal.style.display = 'none';
    } else if (event.target === editModal) {
        editModal.style.display = 'none';
    }
});
