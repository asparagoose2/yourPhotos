
window.onload = () => {
    $('#loginBtn').click(async (event) => {
        event.preventDefault();
        console.log("click");
        const user = {
            email: $('#email').val(),
            password: $('#password').val(),
        }
        fetch(`http://localhost:3000/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(res => {
            res.json().then(data => {
                if(data.status) {
                    window.location.href=`http://localhost:3000/create_event.html`;
                }
                else{
                    errorMsg.style.display="block";
                    setTimeout(function(){
                        errorMsg.style.display="none";
                    }, 1500);
                }
            })
            
        })
    });
    
}