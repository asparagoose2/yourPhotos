$(document).ready(function () {
    let idUrl = getIdFromUrl($(location).attr("search"));
    getEvent(idUrl)
})

const getIdFromUrl = (_url) => {
    let url = _url.replace('?', "");
    let array = url.split("&");
    let id = ""
    array.forEach(element => {
        let x = element.split("=");
        if (x[0] == 'id') {
            id = x[1];
        }
    });
    return id;
}


const getEvent = (_id) => {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/gallery/" + _id,
        success: function (data) {

            $("#first_name").val(data[0].first_name);
            $("#last_name").val(data[0].last_name);
            $("#phone").val(data[0].phone);
            $("#email").val(data[0].email);

        }
    })
}

$("#update_contact").submit(function (e) {
    let idUrl = getIdFromUrl($(location).attr("search"));
    e.preventDefault();
    let fn = $("#first_name").val();
    let ln = $("#last_name").val();
    let pn = $("#phone").val();
    let em = $("#email").val();

    $.ajax({
        type: "PUT",
        url: "http://localhost:3000/api/gallery/" + idUrl,
        data: {
            first_name: fn,
            last_name: ln,
            phone: pn,
            email: em
        },
        success: function (data) {
        },
        error: function (error){
            console.log(error);
        }

    })

})