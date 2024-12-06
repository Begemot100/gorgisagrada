function openGroupModal(event) {
    const modal = document.getElementById('groupModal');
    const button = event.target; // The button clicked to open the modal

    if (modal && button) {
        // Get the button's position
        const rect = button.getBoundingClientRect();

        // Position the modal below the button
        modal.style.position = 'absolute';
        modal.style.top = `${rect.bottom + window.scrollY+70}px`; // Below the button
        modal.style.left = `${rect.left + window.scrollX+100}px`;  // Aligned with the button

        // Show the modal
        modal.classList.remove('hidden');
        modal.style.display = 'block';

    }
}

function filterByGroup(checkbox) {
    const selectedGroup = checkbox.value; // Получаем выбранную группу
    console.log(`Filtering employees by group: ${selectedGroup}`);

    const employees = document.querySelectorAll('.employee-section');
    employees.forEach(employee => {
        const group = employee.dataset.group; // Считываем группу из атрибута data-group
        if (checkbox.checked && group === selectedGroup) {
            employee.style.display = "block"; // Показываем сотрудника
        } else if (!checkbox.checked) {
            employee.style.display = "none"; // Скрываем, если группа не выбрана
        }
    });
}

function closeGroupModal() {
    const modal = document.getElementById('groupModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
    }
}
