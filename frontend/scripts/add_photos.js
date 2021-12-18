$("#eventform").submit(function(e) {
    e.preventDefault();
    const eventId = $("input[name='event_name']").val()
    $.get("http://localhost:3000/api/events/" + eventId, function(data) {
        if(data.status) {
            $("#eventAlert").text("Event name: " + data.event.name);
            $("#eventAlert").css("display", "block");
            $("#photosInput").prop('disabled', false);
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
