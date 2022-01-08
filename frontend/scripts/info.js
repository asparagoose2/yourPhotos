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
           
            let html = `
                <strong>First Name:</strong> ${data[0].first_name} <br>
                <strong>Last Name:</strong> ${data[0].last_name} <br>
                <strong>Phone:</strong> ${data[0].phone} <br>
                <strong>Email:</strong> ${data[0].email} <br>
            `;

            $("#contactInfo").empty();
            $("#contactInfo").html(html);
            $("#update_btn").prop("href","./form.html?id="+_id)

        }
    })
}