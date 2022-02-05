let user = {};
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
        url: API_URL+"/api/gallery/" + _id,
        success: function (data) {
            user = data.data[0];
            if(user.photos.length == 0){
                let htmlh =`Hey ${user.first_name}!`;              
                let htmlp = `
                <strong>First Name:</strong> ${user.first_name} <br>
                <strong>Last Name:</strong> ${user.last_name} <br>
                <strong>Phone:</strong> ${user.phone} <br>
                <strong>Email:</strong> ${user.email} <br>
            `;

                $("#hello").empty();
                $("#hello").html(htmlh);
                $("#contactInfo").empty();
                $("#contactInfo").html(htmlp);

            // $("#update_btn").prop("href","./form.html?id="+_id)
            }
            else{
                window.location.href = "./gallery.html?id="+_id;
            }
        

        }
    })
}
let modal = document.getElementById("myModal");
let btn = document.getElementById("update_btn");
let span = document.getElementsByClassName("close_update")[0];
btn.onclick = function () {
    modal.style.display = "block";
    $("#first_name").val(user.first_name);
    $("#last_name").val(user.last_name);
    $("#phone").val(user.phone);    
    $("#email").val(user.email);
    $("#update_contact").submit(function (e) {
        let idUrl = getIdFromUrl($(location).attr("search"));
        e.preventDefault();
        let fn = $("#first_name").val();
        let ln = $("#last_name").val();
        let pn = $("#phone").val();
        let em = $("#email").val();

        $.ajax({
            type: "PUT",
            url: API_URL+"/api/gallery/" + idUrl,
            data: {
                first_name: fn,
                last_name: ln,
                phone: pn,
                email: em
            },
            success: function (data) {
                location.reload();
                modal.style.display = "none";
            },
            error: function (error) {
                console.log(error);
            }

        })

    })

}

span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}