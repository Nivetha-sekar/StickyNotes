const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

//Getting local storage if exists and parsing them to js obj else passing an empty array to notes
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

//Callback function to show the popup box when add new note is clicked
addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  if(window.innerWidth > 660) titleTag.focus();
});

//Callback function to close the popup box when x icon is clicked
closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = "";
  descTag.value = "";
  popupBox.classList.remove("show");
});

function showNotes() {
  if(!notes) return;
  document.querySelectorAll(".note").forEach(li => li.remove());
  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", '<br/>');
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i> 
                                <ul class="menu">
                                <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}
showNotes();

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    //Removing show class from settings menu on document click
    if(e.target.tagName != "I" || e.target != elem) {
        elem.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(noteId) {
  // let confirmDel = confirm("Are you sure you want to delete this note?");
  // if(!confirmDel) return;
  //Removing selected note from array/tasks
  notes.splice(noteId, 1);
  //Saving updated notes to localStorage
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}

//Callback function to show the title, desc and date in console
addBtn.addEventListener("click", e => {
  e.preventDefault(); //to prevent the form from getting submitted
  let noteTitle = titleTag.value.trim(),
  description = descTag.value.trim();

  if (noteTitle || description) {
    let dateObj = new Date(), //get current date
      month = months[dateObj.getMonth()],
      day = dateObj.getDate(),
      year = dateObj.getFullYear();

    let noteInfo = {
      title: noteTitle,
      description: description,
      date: `${month} ${day}, ${year}`,
    };
    if(!isUpdate) {
      notes.push(noteInfo); //Adding new note to notes
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo; //Updating specific note
    }

    //Saving notes to local storage
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});
