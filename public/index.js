console.log("JS Connected");

var loginSection = document.getElementsByClassName('login')[0];
var registerSection = document.getElementsByClassName('register')[0];
var aboutSection = document.getElementsByClassName('about')[0];
var buttons = document.getElementsByClassName('about__button');
var backButtons = document.getElementsByClassName('forms__back-button');
var loginForm = document.getElementById('loginForm');
var registerForm = document.getElementById('registerForm');
var loginEmail = document.getElementById('loginEmail');
var loginPassword = document.getElementById('loginPassword');
var loginError = document.getElementsByClassName('login__error')[0];
var registerPasswordError = document.getElementsByClassName('register__password-error')[0];
var registerConfirmPasswordError = document.getElementsByClassName('register__confirm-password-error')[0];
var registerUsername = document.getElementById('registerUsername');
var registerName = document.getElementById('registerName');
var registerEmail = document.getElementById('registerEmail');
var registerPassword = document.getElementById('registerPassword');
var registerConfirmPassword = document.getElementById('registerConfirmPassword');
var registerError = document.getElementsByClassName('register__error')[0];

buttons[0].addEventListener("click", function() {
  loginSection.style.display = 'block';
  registerSection.style.display = 'none';
  aboutSection.style.display = 'none';
})

buttons[1].addEventListener("click", function() {
  registerSection.style.display = 'block';
  loginSection.style.display = 'none';
  aboutSection.style.display = 'none';
})

backButtons[0].addEventListener("click", function() {
  loginSection.style.display = 'none';
  registerSection.style.display = 'none';
  aboutSection.style.display = 'block';
})

backButtons[1].addEventListener("click", function() {
  loginSection.style.display = 'none';
  registerSection.style.display = 'none';
  aboutSection.style.display = 'block';
})

buttons[1].addEventListener("click", function() {
  registerSection.style.display = 'block';
  loginSection.style.display = 'none';
  aboutSection.style.display = 'none';
})

function apiRequest(url, body, displayError) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 201) {
      window.location.href = xhr.getResponseHeader('Location')
    }
    else if(xhr.readyState === 4 && xhr.status >= 400){
      console.log("You do not have an account!");
      displayError.textContent = xhr.responseText;
    }
  }
  xhr.open('POST', url, true);
  xhr.send(body);
}

function passwordMatch() {
  if (registerPassword.value !== registerConfirmPassword.value) {
    registerConfirmPasswordError.classList.add('show-error');
  } else {
    registerConfirmPasswordError.classList.remove('show-error');
  }
}

// function strongPassword(){
//   var passwordRegex = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$');
//   if(!passwordRegex.test(registerPassword.value)){
//     registerPasswordError.classList.add('show-error');
//   } else {
//     registerPasswordError.classList.remove('show-error');
//   }
// }


registerForm.addEventListener('submit', function(event) {
  event.preventDefault();
  console.log("begining")
  var body = JSON.stringify({
    username: registerUsername.value,
    name: registerName.value,
    email: registerEmail.value,
    password: registerPassword.value
  });
  console.log("body! ", body)
  apiRequest('/register', body);
})

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  console.log("begining")
  var body = JSON.stringify({
    email: loginEmail.value,
    password: loginPassword.value
  });
  console.log("body! ", body)
  apiRequest('/login', body, loginError);
})
