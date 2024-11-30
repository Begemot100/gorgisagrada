// dotmodal.js
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-menu');
    if (dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
    } else {
        dropdown.classList.add('hidden');
    }
}

// Close the dropdown if clicked outside
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('dropdown-menu');
    const ellipsisButton = document.querySelector('.ellipsis-btn');

    // If the click is outside the dropdown and button, close the dropdown
    if (!dropdown.contains(event.target) && !ellipsisButton.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});

console.log("dotmodal.js is working!");
