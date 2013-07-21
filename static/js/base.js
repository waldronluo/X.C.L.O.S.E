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

function signin() {
    var name = document.getElementById ("signinUsername");
    var password = document.getElementById ("signinPassword");
    var password2 = document.getElementById ("signinPassword2");
    var email = document.getElementById ("signinEmail");
    console.log (password.value != password2.value) ;
    if (password.value != password2.value) {
        var p = document.createElement ("p");
        p.style.color = "#FF3311";
        p.innerHTML = "两次密码不一致哦";
        document.getElementById ("signinForm").appendChild (p);
        return false;
    }
    else {
        if (GLOBAL.socket != "undefined") {
            GLOBAL.socket.emit ("register",[name.value, password.value, email.value]);
            GLOBAL.socket.on ("registerReply", function (ifsignin) {
                if (ifsignin == false){
                    var p = document.createElement ("p");
                    p.style.color = "#FF3311";
                    p.innerHTML = "这个名字已经有人用了。。。";
                    document.getElementById ("signinForm").appendChild (p);
                } else {
                    setCookie ("name", name.value);
                    setCookie ("password", password.value);
                    userlog = document.getElementById("userlog");
                    userlog.style.display = "none";
                    logged = document.getElementById("logged");
                    logged.style.display = "block";
                    X();
                }
            });
        }
    }
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
        setCookie ("iflogin" , iflogin);
        if (iflogin == true) {
            setCookie ("name", name.value);
            setCookie ("password", password.value);
            userlog = document.getElementById("userlog");
            userlog.style.display = "none";
            logged = document.getElementById("logged");
            logged.style.display = "block";
        }
        X();
    });
}

function logout() {
    console.log ("AAA");
    if (GLOBAL.socket != "undefined")
        GLOBAL.socket.emit ("logout", [getCookie("name")]);
    setCookie("iflogin", "false");
    userlog = document.getElementById("userlog");
    userlog.style.display = "block";
    logged = document.getElementById("logged");
    logged.style.display = "none";
    console.log ("AAA");

}

function checkLogin () {
    iflogin = getCookie("iflogin");
    if (iflogin == "true"){ 
        window.location.href="/teach-plan-edit";
        return true;
    } else {
        alert("先登录一下啊");
        return false;
    }
}

(function() {
    console.log(getCookie("iflogin"));
    if (getCookie("iflogin") == "true") {
        userlog = document.getElementById("userlog");
        userlog.style.display = "none";
        logged = document.getElementById("logged");
        logged.style.display = "block";
        console.log("login done");
    } else {
        userlog = document.getElementById("userlog");
        userlog.style.display = "block";
        logged = document.getElementById("logged");
        logged.style.display = "none";
        console.log("login undone");
    }
})();
