$(function() {
    $("header").css("background-color", "rgba(0,0,0,0.5)");
    console.log("gallery.js loaded");
    $.get("http://localhost:3000/api/gallery/"+window.location.href.split("?")[1], function(data,status) {
        console.log(data);
        data = data[0];
        if(data.photos && data.photos.length !== 0) {
            const photos = data.photos;
            for (let i = 0; i < photos.length; i++) {
                const photo = photos[i];
                const photoDiv = $("<div>");
                const photoA = $("<a>");
                photoA.attr("href", photo.split("/")[photo.split("/").length - 1]);
                photoDiv.addClass("col-6");
                const photoImg = $("<img>");
                photoImg.attr("src", photo);
                photoImg.addClass("img-thumbnail rounded");
                photoA.append(photoImg);
                photoDiv.append(photoA);
                $("#gallery").append(photoDiv);
            }
        } else {
            // window.location = "http://localhost:3000/info.html";
        }
    });
});

