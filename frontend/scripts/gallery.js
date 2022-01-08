$(function() {
    $("header").css("background-color", "rgba(0,0,0,0.5)");
    console.log("gallery.js loaded");
    $.get("http://10.0.0.23:3000/api/gallery/"+urlParams.get('id'), function(data,status) {
        console.log(data);
        data = data.data[0];
        if(data.photos && data.photos.length !== 0) {
            const photos = data.photos;
            for (let i = 0; i < photos.length; i++) {
                const photo = photos[i];
                const photoDiv = $("<div>");
                const photoA = $("<a>");
                photoA.attr("href", '#');
                photoA.attr("data-toggle", "modal");
                photoA.attr("data-target", "#photoModal");
                photoA.click(openPhotoModal)
                photoDiv.addClass("col-6");
                const photoImg = $("<img>");
                photoImg.attr("src", '/' + photo);
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

openPhotoModal = function(e) {
    e.preventDefault();
    const photo = $(this).find("img").attr("src");
    $("#photoModal").find("img").attr("src", photo);
}

// $("#downloadBtn").click(function(e) {
//     e.preventDefault();
//     const photo = $("#photoModal").find("img").attr("src");
//     fetch("http://localhost:3000/photos/downloadPhoto?photo=" + photo);
// });


$("#downloadBtn").click(function(e) {
    e.preventDefault(); 
    const photo = $("#photoModal").find("img").attr("src"); 
    console.log("click");
    
    $.ajax({
        url: API_URL+"/photos/downloadPhoto?photo=" + photo,
        type: "GET",
        cache: false,
        contentType: false,
        processData: false,
        xhrFields: {
            responseType: 'blob' // to avoid binary data being mangled on charset conversion
        },
        success: function(blob, status, xhr) {
            // console.log(blob);
            // check for a filename
            var filename = "";
            console.log(xhr.getAllResponseHeaders());
            var disposition = xhr.getResponseHeader('Content-Disposition');
            console.log(disposition);
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
            }
    
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                window.navigator.msSaveBlob(blob, filename);
            } else {
                var URL = window.URL || window.webkitURL;
                var downloadUrl = URL.createObjectURL(blob);
    
                if (filename) {
                    // use HTML5 a[download] attribute to specify filename
                    var a = document.createElement("a");
                    // safari doesn't support this yet
                    if (typeof a.download === 'undefined') {
                        window.location.href = downloadUrl;
                    } else {
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                    }
                } else {
                    window.location.href = downloadUrl;
                }
    
                setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
            }
        }
    });
});