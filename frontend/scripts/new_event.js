

$("form#csvform").submit(function(e) {
    e.preventDefault();    
    var formData = new FormData(this);
    console.log(formData);
    $.ajax({
        url: "http://localhost:3000/photos/newEvent",
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


