/**
 * Created by jakobtottrup on 25/04/2017.
 */


var selected = [];
var deleteUserId = [];
var adminClicked = false;
var paymentClicked = false;

/**
 * Sends GET request to router localhost:3000/api/users as admin
 * returns userdata in JSON format.
 */
function getUsersData() {
    return $.ajax({
        type: 'GET',
        url: "/api/users",
        dataType: "json"
    }).done(function (data) {
        usersData = data;
    });
}


/**
 * Sends DELETE request to router localhost:3000/admins/users/USER_ID as admin
 * @param id
 */
function deleteUser(id) {
    $.ajax({
        type: 'DELETE',
        url: '/admins/users/' + id,
        dataType: 'json'
    });
}


/**
 * Sends PUT request to router localhost:3000/admins/users/USER_ID/
 * @param id - the unique object_id of the user(s) selected
 * @param adminClicked - boolean value indicating if update admin button was clicked
 * @param paymentClicked - boolean value indicating if update payment button was clicked
 */
function updateUsers(id, adminClicked, paymentClicked) {
    $.ajax({
        type: 'PUT',
        url: '/admins/users/' + id +"/"+ adminClicked + "/" + paymentClicked,
        dataType: 'json'
    });
}

/**
 * Function runs when getUserData() is finished loading.
 * - generates table with each row having unique id of row + i
 * - inserts each users' data into the table cells.
 */
$.when(getUsersData().done(function () {
    $("#data_insert").empty();
    for (i = 0; i < usersData.length; i++) {
        $('#data_insert').append("<tr class='data_row' id='row" + i + "'>" +
            "<td hidden>" + usersData[i]._id + "</td>" +
            "<td><input type='checkbox' class='user_checkbox'></td>" +
            "<td>" + i + "</td>" +
            "<td>" + usersData[i].username + "</td>" +
            "<td>" + usersData[i].age + "</td>" +
            "<td>" + usersData[i].email + "</td>" +
            "<td>" + usersData[i].studie + "</td>" +
            "<td>" + usersData[i].fakultet + "</td>" +
            "<td>" + usersData[i].bnet + "</td>" +
            "<td>" + usersData[i].steam + "</td>"+
            "<td>" + usersData[i].isAdmin + "</td>"+
            "<td>" + usersData[i].hasPaid + "</td>"+
            "<td>" + usersData[i].isActive + "</td></tr>");
    }

    /**
     * Enables and disables user manipulation buttons when 0-* are selected
     * deleteUserID.push selects the checkbox that was clicked, traverses up to closest <tr> element,
     * and then finds the 3rd <td> element's text value (user ID)
     */
    $(function () {
        $('.user_checkbox').click(function () {
            if ($(this).is(':checked')) {
                $(':button').prop('disabled', false);
                deleteUserId.push(usersData[$(this).closest('tr').find('td:eq(2)').text()]);
                selected.push($(this).closest('tr').find('td:eq(2)').text());
            } else {
                $(':button').prop('disabled', true);
            }
        })
    });
}));


/**
 * Admin toggle button click function
 *  - sets two boolean values indicating which button was clicked.
 *  - for each selected user, updateUsers() is called
 *  - after updates, the page is reloaded.
 */
$(function() {
    $('#toggleAdminBtn').click(function() {
        adminClicked = true;
        paymentClicked = false;
        for (i = 0; i < deleteUserId.length; i++) {
            updateUsers(deleteUserId[i]._id, adminClicked, paymentClicked);
        }
        location.reload(true);
    });
});


/**
 * Payment toggle button click function
 *  - sets two boolean values indicating which button was clicked.
 *  - for each selected user, updateUsers() is called
 *  - after updates, the page is reloaded.
 */
$(function () {
    $("#togglePaymentBtn").click(function () {
        paymentClicked = true;
        adminClicked = false;
        for (i=0;i<deleteUserId.length; i++) {
            updateUsers(deleteUserId[i]._id, adminClicked, paymentClicked);
        }
        location.reload(true);
    });
});

/**
 * Delete user button
 * - Prompts the user to confirm deletion of selected user(s)
 * - runs deleteUser() on each user_ID in deleteUserId
 * - unchecks all checkboxes and clears deleteUserId[] and selected[]
 * - reloads page when function is complete.
 */
$(function () {
    $('#removeUserBtn').click(function (e) {
        /*console.log(deleteUserId[i]._id);*/
        alert("Are you sure you wish to delete selected users?"); //todo: enable dobbelt-check på user delete
        for (i = 0; i < deleteUserId.length; i++) {
            deleteUser(deleteUserId[i]._id);
        }
        $(':checkbox').prop('checked', false);
        var table = $(e.target).closest('table');
        selected = [];
        deleteUserId = [];
        location.reload(true);
    })
});

/**
 * Checkbox control
 * - When the checkbox with id="selectAll" is clicked, the buttons are enabled or disabled
 * - Each <td> element containing a :checkbox is also checked/unchecked
 * - for each checked checkbox, the userID is pushed into deleteUserId.
 */
$(function () {
    $('#selectAll').click(function (e) {
        if ($(this).is(':checked')) {
            $(':button').prop('disabled', false);
        } else {
            $(':button').prop('disabled', true);
        }
        var table = $(e.target).closest('table');
        $('td :checkbox', table).prop('checked', this.checked);
        $('.user_checkbox').each(function () {
            deleteUserId.push(usersData[$(this).closest('tr').find('td:eq(2)').text()]);
            selected.push($(this).closest('tr').find('td:eq(2)').text());
        });
    });
});


