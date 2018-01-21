var form = document.getElementsByClassName('new-draw__form')[0];
var displayNewInputs = document.getElementsByClassName('new-draw__form__new-inputs')[0];
var addNameButton = document.getElementById('addNameButton');
var inputTitle = document.getElementById('title');
var displayNamesSection = document.getElementsByClassName('all-names__container')[0];
var allNamesBtn = document.getElementsByClassName('all-names__each-div');
var number = 3;

function addFields() {
  number = number + 1;
  var namelabel = document.createElement('label');
  namelabel.setAttribute('for', 'name3');
  namelabel.textContent = "Name " + number;
  namelabel.classList.add('new-draw__form__labels')
  var nameinput = document.createElement('input');
  nameinput.setAttribute('type', 'text');
  nameinput.setAttribute('name', 'entryperson' + number)
  nameinput.setAttribute('id', 'name' + number);
  nameinput.classList.add('new-draw__form__inputs')
  namelabel.appendChild(nameinput);
  displayNewInputs.appendChild(namelabel)
  var emaillabel = document.createElement('label');
  emaillabel.setAttribute('for', 'email' + number);
  emaillabel.textContent = "Email " + number;
  emaillabel.classList.add('new-draw__form__labels')
  var emailinput = document.createElement('input');
  emailinput.setAttribute('type', 'email');
  emailinput.setAttribute('name', 'entryemail' + number)
  emailinput.setAttribute('id', 'email' + number);
  emailinput.classList.add('new-draw__form__inputs')
  emaillabel.appendChild(emailinput);
  displayNewInputs.appendChild(emaillabel)
}

addNameButton.addEventListener('click', addFields);

function postRequest(url, body, displayNamesSection) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 201) {
      displayNamesSection.textContent = "Names have been added";
      window.location.href = xhr.getResponseHeader('Location')
    } else if (xhr.readyState === 4 && xhr.status >= 400) {
      displayNamesSection.textContent = xhr.responseText;
    }
  }
  xhr.open('POST', url, true);
  xhr.send(body);
}

form.addEventListener('submit', function(event) {
  event.preventDefault();
  var participantsArr = [{
    title: inputTitle.value.toLowerCase()
  }];
  for (var i = 1; i <= number; i++) {
    var inputName = document.getElementById('name' + i)
    var inputEmail = document.getElementById('email' + i)
    participantsArr.push({
      name: inputName.value.toLowerCase(),
      email: inputEmail.value.toLowerCase()
    })
  }
  console.log(participantsArr);
  postRequest('/allParticipantsInfo', JSON.stringify(participantsArr), displayNamesSection)
})

function getRequest(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var result = JSON.parse(xhr.responseText)
      cb(result);
    } else if (xhr.readyState === 4 && xhr.status >= 400) {
      displayNamesSection.textContent = "Unfortunately we have been unnable to retrieve all your groups and names. Please try again later."
    }
  }
  xhr.open('get', url, true);
  xhr.send();
}

window.onload = function() {
  getRequest('/getAllNames', displayNames);
}

function postRequest(url, info, displayError) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 201) {
      window.location.href = xhr.getResponseHeader('Location')
    } else if (xhr.readyState === 4 && xhr.status >= 400) {
      displayError.textContent = xhr.responseText;
    }
  }
  xhr.open('POST', url, true);
  xhr.send(info);
}

function createGroupDivBtnsAndh3(uniqueTitlesArr, createNameAndEmailElement, persons){
  uniqueTitlesArr.map(function(title, i) {
    var div = document.createElement('div')
    div.classList.add("all-names__each-div")
    var h3 = document.createElement('h3');
    h3.classList.add('all-names__each-heading')
    var drawBtn = document.createElement('button')
    drawBtn.classList.add("all-names__draw-btn")
    drawBtn.textContent = "Draw names";
    drawBtn.id = "drawBtn" + i;
    var deleteGroup = document.createElement('button')
    deleteGroup.classList.add("all-names__draw-delete-group")
    deleteGroup.textContent = "Delete group";
    deleteGroup.id = "deleteGroup"+i;
    h3.textContent = title;
    div.appendChild(h3)
    displayNamesSection.appendChild(div)

    createNameAndEmailElement(persons, h3, div);
    div.appendChild(drawBtn);
    div.appendChild(deleteGroup);
    drawBtnClick(drawBtn);
    deleteBtnClick(deleteGroup);
  })
}

function createNameAndEmailElement(persons, title, div) {
  persons.map(function(person, i) {
    if (title.textContent === person.title) {
      var namePara = document.createElement('p');
      namePara.textContent = person.name;
      namePara.classList.add("all-names__each-name");
      namePara.id = "partipantName"+i;
      var emailPara = document.createElement('p');
      emailPara.classList.add("all-names__each-email")
      emailPara.textContent = person.email;
      emailPara.id = "partipantEmail"+i
      emailPara.contentEditable = false;
      var buttonDiv = document.createElement('div')
      buttonDiv.classList.add("all-names__each-buttonDiv")
      var editBtn = document.createElement('button');
      editBtn.textContent = "Edit";
      editBtn.classList.add("all-names__each-edit");
      editBtn.id = "editBtn"+i;
      var deleteBtn = document.createElement('button');
      deleteBtn.classList.add("all-names__each-delete")
      deleteBtn.textContent = "Delete";
      deleteBtn.id = 'deleteBtn'+i;
      div.appendChild(namePara)
      div.appendChild(emailPara)
      buttonDiv.appendChild(editBtn)
      buttonDiv.appendChild(deleteBtn)
      div.appendChild(buttonDiv)
      editEachPersonClick(editBtn, namePara, emailPara)
      deleteEachPersonClick(deleteBtn);
    }
  })
}

function getTitles(persons){
  return persons.map(function(obj) {
    return obj.title;
  });
}

function getUniqueTitles(titlesArr){
  return titlesArr.filter(function(title, i) {
    return titlesArr.indexOf(title) == i;
  });
}

function displayNames(persons) {
  if (persons.length === 0) {
    displayNamesSection.textContent = "You currently have no groups."
  }
  const titles = getTitles(persons);
  const uniqueTitles = getUniqueTitles(titles);
  createGroupDivBtnsAndh3(uniqueTitles, createNameAndEmailElement, persons)
}

function drawBtnClick(drawBtn) {
  document.getElementById(drawBtn.id).addEventListener("click", function() {
    sendDrawInfo(drawBtn);
  })
}

function deleteBtnClick(deleteBtn) {
  document.getElementById(deleteBtn.id).addEventListener("click", function() {
    deleteGroup(deleteBtn);
  })
}

function editEachPersonClick(editButton, nameParagraph, emailParagraph, previousEmail){
  document.getElementById(editButton.id).addEventListener("click", function() {
    editEachPerson(editButton, nameParagraph, emailParagraph, previousEmail);
  })
}
  
function editEachPerson(editButton, nameParagraph, emailParagraph){
    var previousEmail = emailParagraph.textContent;
  if(editButton.textContent === "Edit"){
    nameParagraph.contentEditable=true;
    nameParagraph.style.border = "1px solid black"
    emailParagraph.contentEditable=true;
    emailParagraph.style.border = "1px solid black"
    editButton.textContent = "Save";
    console.log("hey");
    console.log(emailParagraph.textContent);
    console.log(nameParagraph.textContent);

      console.log("previousEmail if: ", previousEmail);
  } else {
    console.log("previousEmail else: ", previousEmail);
    saveEdit(editButton, nameParagraph, emailParagraph, emailParagraph.textContent)
}
}

function saveEdit(editButton, nameParagraph, emailParagraph, previousEmail){
  var title = editButton.parentElement.parentElement.firstChild.textContent.toLowerCase();
  console.log("title: ", title);
  console.log("name: ", nameParagraph.textContent);
  console.log("email: ",emailParagraph.textContent);
  var info = [
    {title: title},
    {email: emailParagraph.textContent},
    {name: nameParagraph.textContent},
    {previousEmail: previousEmail}
  ]
  console.log(info);
  postRequest("/editPerson", JSON.stringify(info), displayError=null);
}

function deleteEachPersonClick(deleteButton){
  document.getElementById(deleteButton.id).addEventListener("click", function() {
    deleteEachPerson(deleteButton);
  })
}

function deleteEachPerson(deleteButton){
  var id = deleteButton.id.split("n")[1];
  var email = document.getElementById("partipantEmail"+id).textContent.split(":")[1].trim();
  var title = deleteButton.parentElement.parentElement.firstChild.textContent.toLowerCase();
  var info = [
    {email: email},
    {title: title}
  ]
  console.log(info);
  postRequest("/deletePerson", JSON.stringify(info), displayError=null);
}
function deleteGroup(deleteBtn){
  var titleElementText = deleteBtn.parentElement.firstChild.textContent.toLowerCase();
  var groupTitle = {title: titleElementText};
  postRequest("/deleteGroup", JSON.stringify(groupTitle), displayError=null);
}

function sendDrawInfo(drawBtn){
  var parentElementChildren = Array.from(drawBtn.parentElement.childNodes);
  var title = drawBtn.parentElement.firstChild.textContent.toLowerCase();
  var namesArr = [title]
  var nameFilter = parentElementChildren.filter(function(el){
    if(el.classList.contains("all-names__each-email")){
       namesArr.push(el.textContent.split(":")[1].trim().toLowerCase())
    }
  })
  postRequest("/drawNames", JSON.stringify(namesArr), displayError=null);
}
