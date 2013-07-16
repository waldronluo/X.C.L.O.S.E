function signin() {
    var block = document.getElementById("blockEverything");
    var signin = document.getElementById("signin");
    signin.style.visibility = "visible";
    block.style.visibility = "visible";
}

function login() {
    var block = document.getElementById("blockEverything");
    var login = document.getElementById("login");
    login.style.visibility = "visible";
    block.style.visibility = "visible";
}

function X() {
    var block = document.getElementById("blockEverything");
    var signin = document.getElementById("signin");
    var login = document.getElementById("login");
    signin.style.visibility = "hidden";
    login.style.visibility = "hidden";
    block.style.visibility = "hidden";
}
