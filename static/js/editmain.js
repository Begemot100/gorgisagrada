document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const employeeCard = event.target.closest('.employee-card');
            const employeeName = employeeCard.querySelector('.employee-name').innerText;

            if (confirm(`¿Seguro que quieres eliminar a ${employeeName}?`)) {
                // Логика удаления
                alert(`${employeeName} eliminado`);
            }
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Логика редактирования
            alert('Abrir modal de edición');
        });
    });
});
