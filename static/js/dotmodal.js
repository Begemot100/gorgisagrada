document.addEventListener("DOMContentLoaded", () => {
    const dropdownMenu = document.getElementById("dropdown-menu");
    const ellipsisButton = document.querySelector(".ellipsis-btn");
    const randomBtn = document.getElementById("random-btn");
    const chooseAllBtn = document.getElementById("choose-all-btn");
    const employeeCheckboxes = document.querySelectorAll(".round-checkbox");
    let randomState = false; // Следим за состоянием "Random"

    // Функция для показа/скрытия выпадающего меню
    function toggleDropdown(event) {
        event.stopPropagation(); // Предотвращаем всплытие события
        dropdownMenu.classList.toggle("hidden");
    }

    // Функция для закрытия выпадающего меню
    function closeDropdown() {
        dropdownMenu.classList.add("hidden");
    }

    // Показать или скрыть выпадающее меню при клике на троеточие
    ellipsisButton.addEventListener("click", toggleDropdown);

    // Закрытие выпадающего меню при клике вне его
    document.addEventListener("click", (event) => {
        if (!dropdownMenu.classList.contains("hidden") && !dropdownMenu.contains(event.target)) {
            closeDropdown();
        }
    });

    // Закрытие выпадающего меню при клике на элемент меню
    dropdownMenu.addEventListener("click", (event) => {
        if (event.target.tagName === "LI") {
            closeDropdown();
        }
    });

    // Логика для кнопки "Random"
    randomBtn.addEventListener("click", () => {
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
    chooseAllBtn.addEventListener("click", () => {
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
});
