
window.onload = () => {
    $('#loginBtn').click(async (event) => {
        event.preventDefault();
        const user = {
            email: $('#email').val(),
            password: $('#password').val(),
        }
        $.ajax({
            type: "POST",
            url:"http://localhost:3000/api/users/login",
            data: { 
                "VarA": email, 
                "VarB": password
            },
            success: function(response) {
                //Do Something
            },
            error: function(xhr) {
                //Do Something to handle error
            }

            });
        
    });
}