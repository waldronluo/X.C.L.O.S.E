function signinWindow() {
    var block = document.getElementById("blockEverything");
    var signin = document.getElementById("signin");
    signin.style.visibility = "visible";
    block.style.visibility = "visible";
}

function loginWindow() {
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

function login() {
    console.log("login");
    var name = document.getElementById("loginUsername");
    var password = document.getElementById("loginUserPassword");
    if (GLOBAL.socket != "undefined")
        GLOBAL.socket.emit ("login", [name.value, password.value]);
    //console.log ([name.value, password.value]);
    GLOBAL.socket.on ("loginReply", function (iflogin) {
        console.log (iflogin);
        if (iflogin == true) {
            setCookie ("name", name.value);
            setCookie ("password", password.value);
        }
    });
}
