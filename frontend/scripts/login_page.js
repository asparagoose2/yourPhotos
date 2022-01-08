const data 
window.onload = () => {
    $('#loginBtn').click(async (event) => {
        event.preventDefault();
        const user = {
            email: $('##email').val(),
            password: $('#password').val(),
        }
        fetch(`http://localhost:3000/api/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(res => {
            return res.json();
        })
        .then(data => {
            window.location.href=`http://127.0.0.1:3000/user.html`;
        })
            .catch(e => console.log(e))
    });
}