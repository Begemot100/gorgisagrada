document.addEventListener('DOMContentLoaded', () => {
    // Найти все кнопки с троеточиями
    const ellipsisButtons = document.querySelectorAll('.ellipsis-btn'); // Используем класс для всех кнопок
    const dotModals = document.querySelectorAll('.dot-modal'); // Находим все модальные окна

    ellipsisButtons.forEach((button, index) => {
        const modal = dotModals[index]; // Соотносим кнопку с модальным окном

        if (!button || !modal) {
            console.error('Ellipsis button or modal not found!');
            return;
        }

        // Показать/скрыть модальное окно при клике на кнопку
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Останавливаем всплытие события
            modal.classList.toggle('hidden'); // Добавляем/убираем класс hidden
        });

        // Закрыть модальное окно, если клик вне его
        document.addEventListener('click', (event) => {
            if (!modal.contains(event.target) && !button.contains(event.target)) {
                modal.classList.add('hidden');
            }
        });
    });
});
