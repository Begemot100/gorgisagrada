document.addEventListener("DOMContentLoaded", () => {
    const dropdownMenu = document.getElementById("dropdown-menu");
    const ellipsisButton = document.querySelector(".ellipsis-btn");
    const randomBtn = document.getElementById("random-btn");
    const chooseAllBtn = document.getElementById("choose-all-btn");
    const employeeCheckboxes = document.querySelectorAll(".round-checkbox");
    const modal = document.getElementById('newscheduleModal');
    let randomState = false; // Следим за состоянием "Random"

    // Проверяем наличие основных элементов
    if (!dropdownMenu) console.error("Dropdown меню не найдено.");
    if (!ellipsisButton) console.error("Кнопка троеточие не найдена.");
    if (!randomBtn) console.error("Кнопка 'Random' не найдена.");
    if (!chooseAllBtn) console.error("Кнопка 'Choose All' не найдена.");
    if (!modal) console.error("Модальное окно с ID 'newscheduleModal' не найдено.");

    // Функция для показа/скрытия выпадающего меню
    function toggleDropdown(event) {
    const dropdownMenu = document.getElementById("dropdown-menu");

    if (!dropdownMenu) {
        console.error("Dropdown меню не найдено.");
        return;
    }

    event.stopPropagation(); // Предотвращаем всплытие события
    dropdownMenu.classList.toggle("hidden"); // Показываем/скрываем меню
}

// Закрытие меню при клике вне его
document.addEventListener("click", (event) => {
    const dropdownMenu = document.getElementById("dropdown-menu");

    if (dropdownMenu && !dropdownMenu.classList.contains("hidden") && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.add("hidden");
    }
});

    // Функция для закрытия выпадающего меню
    function closeDropdown() {
        dropdownMenu.classList.add("hidden");
    }

    // Показать или скрыть выпадающее меню при клике на троеточие
    ellipsisButton?.addEventListener("click", toggleDropdown);

    // Закрытие выпадающего меню при клике вне его
    document.addEventListener("click", (event) => {
        if (!dropdownMenu?.classList.contains("hidden") && !dropdownMenu.contains(event.target)) {
            closeDropdown();
        }
    });

    // Закрытие выпадающего меню при клике на элемент меню
    dropdownMenu?.addEventListener("click", (event) => {
        if (event.target.tagName === "LI") {
            closeDropdown();
        }
    });

    // Логика для кнопки "Random"
    randomBtn?.addEventListener("click", () => {
        if (employeeCheckboxes.length === 0) {
            console.error("Круглые чекбоксы сотрудников не найдены.");
            return;
        }

        // Переключаем состояние "Random"
        randomState = !randomState;

        employeeCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                const employeeId = checkbox.id.replace("employee_", "");
                toggleRandomForEmployee(employeeId, randomState);
            }
        });

        console.log(randomState ? "Random активирован" : "Random отключён");
    });

    // Логика для кнопки "Choose All"
    chooseAllBtn?.addEventListener("click", () => {
        const allChecked = Array.from(employeeCheckboxes).every(checkbox => checkbox.checked);

        employeeCheckboxes.forEach((checkbox) => {
            checkbox.checked = !allChecked; // Переключаем состояние
        });

        console.log(allChecked ? "Все чекбоксы сняты" : "Все чекбоксы выбраны");
    });

    // Функция для управления чекбоксами и кнопками "Random"
    function toggleRandomForEmployee(employeeId, state) {
        const logsContainer = document.getElementById(`logs-container-${employeeId}`);
        const actionButtons = document.getElementById(`action-buttons-${employeeId}`);

        if (!logsContainer) {
            console.error(`Логи для сотрудника с ID employee_${employeeId} не найдены.`);
            return;
        }
        if (!actionButtons) {
            console.error(`Кнопки действий для сотрудника с ID employee_${employeeId} не найдены.`);
            return;
        }

        const checkboxCells = logsContainer.querySelectorAll(".checkbox-cell");

        if (state) {
            checkboxCells.forEach((cell) => cell.classList.remove("hidden"));
            actionButtons.classList.remove("hidden");
        } else {
            checkboxCells.forEach((cell) => cell.classList.add("hidden"));
            actionButtons.classList.add("hidden");
        }
    }

    // Открытие модального окна "Новое расписание"
    function openNewScheduleModal() {
    const modal = document.getElementById('newscheduleModal');
    if (!modal) {
        console.error("Модальное окно с ID 'newscheduleModal' не найдено.");
        return;
    }

    // Проверяем, правильно ли передан элемент
    console.log("Открытие модального окна:", modal);

    // Показать модальное окно
    modal.style.display = 'block';

    // Закрыть модальное окно при клике вне его
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

    // Закрытие модального окна при клике на кнопку закрытия
    document.querySelector('.close-btn')?.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Проверяем, что модальное окно найдено
    if (modal) {
        console.log("Модальное окно найдено.");
    }
});
