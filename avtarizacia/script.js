if (window.localStorage.userProps) {
    window.location.href = '../list/list.html'
}
const form = document.querySelector('#logForm');
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const myForm = new FormData(form);
    console.log(...myForm);
    //! jnjel

    //!  jnjel
    fetch('http://httpbin.org/anything', {
        method: 'POST',
        body: myForm,
    })
        .then(res => {
            if (res.ok) {
                // key полученный ключ запроса;
                // data для отслеживание времени авторизации;
                // user для отображения пользователя в list.html;
                let data = JSON.stringify({ key: 'lpo9987', date: new Date().getDate()})
                window.localStorage.setItem('userProps', data);
                window.location.href = '../list/list.html'
            }
        })
        .catch(err => console.log(err))
})
