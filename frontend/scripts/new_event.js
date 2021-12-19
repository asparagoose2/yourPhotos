window.addEventListener("beforeunload", function(e) { 
    e.preventDefault(); 
    console.log('onbeforeunload6');
    return undefined;
 });

$("#csvform").submit(function(e) {
    e.preventDefault();
    return false;
});

$("#smbt").on("click", function(e) {
    e.preventDefault(); 
    // console.log($("#csvform").serializeArray());
    var formData = new FormData(document.querySelector('form'));
    console.log(formData);
    $.ajax({
        url: "http://localhost:3000/photos/newEvent",
        type: 'POST',
        data: formData,
        success: function (data) {
            console.log("yay");
        },
        cache: false,
        contentType: false,
        processData: false,
    });
    return false;

    // $.ajax({
    //     type: "POST",
    //     url: "http://localhost:3000/photos/newEvent",
    //     data: formData,
    //     cache: false,
    //     contentType: false,
    //     processData: false,
    //     xhrFields: {
    //         responseType: 'blob' // to avoid binary data being mangled on charset conversion
    //     },
    //     success: function(blob, status, xhr) {
    //         // console.log(blob);
    //         // check for a filename
    //         var filename = "";
    //         console.log(xhr.getAllResponseHeaders());
    //         var disposition = xhr.getResponseHeader('Content-Disposition');
    //         console.log(disposition);
    //         if (disposition && disposition.indexOf('attachment') !== -1) {
    //             var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    //             var matches = filenameRegex.exec(disposition);
    //             if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
    //         }
    
    //         if (typeof window.navigator.msSaveBlob !== 'undefined') {
    //             // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
    //             window.navigator.msSaveBlob(blob, filename);
    //         } else {
    //             var URL = window.URL || window.webkitURL;
    //             var downloadUrl = URL.createObjectURL(blob);
    
    //             if (filename) {
    //                 // use HTML5 a[download] attribute to specify filename
    //                 var a = document.createElement("a");
    //                 // safari doesn't support this yet
    //                 if (typeof a.download === 'undefined') {
    //                     window.location.href = downloadUrl;
    //                 } else {
    //                     a.href = downloadUrl;
    //                     a.download = filename;
    //                     document.body.appendChild(a);
    //                     a.click();
    //                 }
    //             } else {
    //                 window.location.href = downloadUrl;
    //             }
    
    //             setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
    //         }
    //     }
    // });

});








// $("#testform").submit(function(e) {
//     e.preventDefault();
//     console.log("test");
//     var formData = new FormData(this);    

//     $.post($(this).attr("action"), formData, function(data) {
//         alert(data);
//     });
// });


// console.log('new_event.js');

// console.log('abc');
// document.getElementById('mybutton').onclick = () => {
//     console.log('abc');
//     $.ajax({
//     // Your server script to process the upload
//     url: 'http://localhost:3000/photos/qr/0c546c43-519e-42d3-9670-fba60fcb264f',
//     type: 'POST',

//     // Form data
//     data: new FormData($('#testform')[0]),

//     // Tell jQuery not to process data or worry about content-type
//     // You *must* include these options!
//     cache: false,
//     contentType: false,
//     processData: false,

//     // Custom XMLHttpRequest
//     xhr: function () {
//         var myXhr = $.ajaxSettings.xhr();
//         if (myXhr.upload) {
//         // For handling the progress of the upload
//         myXhr.upload.addEventListener('progress', function (e) {
//             if (e.lengthComputable) {
//             $('progress').attr({
//                 value: e.loaded,
//                 max: e.total,
//             });
//             }
//         }, false);
//         }
//         return myXhr;
//     }
//     });
// }


