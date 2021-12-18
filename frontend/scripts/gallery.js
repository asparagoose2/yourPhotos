$(function() {
    $("header").css("background-color", "rgba(0,0,0,0.5)");
    console.log("gallery.js loaded");
    $.get("http://localhost:3000/api/gallery", function(data,status) {
        console.log(data);
        if(data.length !== 0) {
            console.log("data.length !== 0");
            console.log(data);
            const photos = data.photos;
            //for all photos create a div
            for (let i = 0; i < photos.length; i++) {
                const photo = photos[i];
                const photoDiv = $("<div>");
                photoDiv.addClass("col-6");
                const photoImg = $("<img>");
                photoImg.attr("src", photo);
                photoImg.addClass("img-thumbnail rounded");
                photoDiv.append(photoImg);
                $("#gallery").append(photoDiv);
            }
        } else {
            console.log("No photos found");
        }
    });
});

