$("#eventform").submit(function(e) {
    e.preventDefault();
    const eventId = $("input[name='event_name']").val()
    $.get("http://localhost:3000/api/events/" + eventId, function(data) {
        if(data.status || true) {
            $("#eventAlert").text("Event name: " + data.event.name);
            $("#eventAlert").css("display", "block");
            $("#photosInput").prop('disabled', false);
            $("input[name='number_of_qr'").prop('disabled', false);
            $("#addQRBtn").prop('disabled', false);
            $("#downloadBtn").prop('disabled', false);
            $("#uploadBtn").prop('disabled', false);

            $("input[name='event_name']").prop('disabled', true);
            $("input[name='event_id']").val(eventId);
        } else {
            $("#eventAlert").text("Event not found");
            $("#eventAlert").addClass("alert-danger");
            $("#eventAlert").removeClass("alert-secondary");
            $("#eventAlert").css("display", "block");
        }
    });
        
});

$("#downloadBtn").click(function(e) {
    e.preventDefault();  
    console.log("click");
    
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/photos/download/"+$("input[type='hidden']").val(),
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


$("form#photosform").submit(function(e) {
    e.preventDefault();    
    var formData = new FormData(this);
    console.log("http://localhost:3000/photos/upload/"+$("input[name='event_id']").val());
    console.log(formData);
    $.ajax({
        url: "http://localhost:3000/photos/upload/"+$("input[name='event_id']").val(),
        type: 'POST',
        data: formData,
        success: function (data) {
            alert(data)
        },
        cache: false,
        contentType: false,
        processData: false
    });
});
