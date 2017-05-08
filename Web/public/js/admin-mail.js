/**
 * Created by jakobtottrup on 02/05/2017.
 */


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
 * Function runs when getUserData() is finished loading.
 * - generates table with each row having unique id of row + i
 * - inserts each users' data into the table cells.
 */
$.when(getUsersData().done(function () {
    $("#data_insert").empty().append("<option>ALL UNPAID</option>");
    for (i = 0; i < usersData.length; i++) {
        $('#data_insert').append("<option>"+usersData[i].email + "</option>");

    }



    /**
     * Enables and disables user manipulation buttons when 0-* are selected
     * deleteUserID.push selects the checkbox that was clicked, traverses up to closest <tr> element,
     * and then finds the 3rd <option> element's text value (user ID)
     */
    /*$(function () {
        $('.user_checkbox').click(function () {
            if ($(this).is(':checked')) {
                $(':button').prop('disabled', false);
                deleteUserId.push(usersData[$(this).closest('tr').find('option:eq(2)').text()]);
                selected.push($(this).closest('tr').find('option:eq(2)').text());
            } else {
                $(':button').prop('disabled', true);
            }
        })
    });*/
    //console.log(usersData);
    var unPaid = [];
    for (i=0;i<usersData.length; i++){
        if(usersData[i].hasPaid == false){
            $('#unpaid_emails').append('<input type="text" name="emails" id="emails'+i+'" class="form-control hidden">');
           // $("#emails").val(usersData[i].email);
            unPaid.push(usersData[i].email);
            //$("#emails").append(usersData[i].email);

            $("#emails"+i).val(usersData[i].email);
        }
    }
    //$('#unpaid_hidden').append(unPaid.toString());

    console.log(unPaid);
}));


