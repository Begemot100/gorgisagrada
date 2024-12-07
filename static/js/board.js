$('.check-in-btn').on('click', function () {
    const employeeId = $(this).data('id');

    if (!employeeId) {
        alert('Employee ID is missing!');
        return;
    }

    $.post(`/check_in/${employeeId}`, function (response) {
        if (response.check_in_time) {
            // Обновляем время в UI
            $(`#check-in-time-${employeeId}`).text(response.check_in_time);

            // Меняем состояние кнопок
            $(`.check-in-btn[data-id="${employeeId}"]`)
                .addClass('disabled')
                .prop('disabled', true)
                .css('background-color', '#ccc');

            $(`.check-out-btn[data-id="${employeeId}"]`)
                .removeClass('disabled')
                .prop('disabled', false)
                .css('background-color', '#dc3545');
        } else {
            alert(response.error || 'Failed to check in. Please try again.');
        }
    });
});



   $('.check-out-btn').on('click', function () {
    const employeeId = $(this).data('id');

    if (!employeeId) {
        alert('Employee ID is missing!');
        return;
    }

    $.post(`/check_out/${employeeId}`, function (response) {
        if (response.check_out_time) {
            // Обновляем время и часы в UI
            $(`#check-out-time-${employeeId}`).text(response.check_out_time);
            $(`#daily-hours-${employeeId}`).text(`Daily: ${response.daily_hours.toFixed(2)}h`);

            // Меняем состояние кнопок
            $(`.check-out-btn[data-id="${employeeId}"]`)
                .addClass('disabled')
                .prop('disabled', true)
                .css('background-color', '#ccc');
        } else {
            alert(response.error || 'Failed to check out. Please try again.');
        }
    }).fail(function () {
        alert('Server error. Please try again later.');
    });
});
$.post(`/check_in/${employeeId}`, function (response) {
    if (response.check_in_time) {
        $(`#check-in-time-${employeeId}`).text(response.check_in_time);
        $(`.check-in-btn[data-id="${employeeId}"]`).prop('disabled', true).addClass('disabled');
        $(`.check-out-btn[data-id="${employeeId}"]`).prop('disabled', false).removeClass('disabled');
    }
});