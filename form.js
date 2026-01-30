const dateBtn = document.getElementById("date");
const slotContainer = document.getElementById("slots-container");
const modal = document.getElementById("modal");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("detailsForm");
const errorMsg = document.getElementById("error-msg");
const showDate = document.getElementById("show-date");
const legendDiv = document.getElementById("legend");
const idError = document.getElementById("id-error");
const goBackBtn = document.getElementById("go-back");

const userBooking = JSON.parse(localStorage.getItem("userBooking")) || [];

const bookingsByDate = JSON.parse(localStorage.getItem("bookingsByDate")) || {};


let selectedTime = null;
let idURL;
let isEdit = false;
let editIndex;
let currUser = null;
let tempServices = "";

function hideAll() {
    slotContainer.innerHTML = "";
    errorMsg.style.display = "flex";
    legendDiv.style.display = "none"
    form.reset();
}

cancelBtn.onclick = () => {
    legendDiv.style.display = "none"
    modal.style.display = "none";
    if (window.location.href.includes("?")) {
        window.location.href = "historyTable.html";
    }
    // else if (window.location.href === "http://127.0.0.1:5500/form.html") {
    //     console.log("Yes");
    //     localStorage.removeItem("service");
    //     window.location.href = "index.html";
    // }
    else{
        localStorage.removeItem("service");
        window.location.href = "index.html";
    }
}

saveBtn.onclick = () => {
    if (addDetails()) {
        if (window.location.href.includes("?")) {
            localStorage.setItem("toastType" , "update");
            window.location.href = "historyTable.html";
        }
        else{
            localStorage.setItem("toastType" , "success");
            window.location.href = "index.html";
        }
        form.reset();
        modal.style.display = "none";
    }
    else{
        localStorage.setItem("toastType" , "error");
    }
}

goBackBtn.onclick = () => {
    window.location.href = "index.html";
}

const startHour = 10;
const endHour = 18;
const duration = 30;

function generateTimeSlots(date) {
    slotContainer.innerHTML = "";
    legendDiv.style.display = "flex";
    
    const timeBooked = bookingsByDate[date] || [];

    let currentHour = startHour;
    let currentMinute = 0;
    while (currentHour < endHour || (currentHour < endHour && currentMinute === 0)) {
        const time = new Date();
        const currTime = new Date();
        time.setHours(currentHour, currentMinute, 0, 0);
        currTime.setHours(currentHour, currentMinute + 30, 0, 0);

        const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const lastTime = currTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });


        const slotButton = document.createElement("button");
        slotButton.value = formattedTime;
        slotButton.textContent = `${formattedTime} - ${lastTime}`;
        slotButton.type = "button";
        slotButton.classList.add('time-slot');

        if(currUser != null && currUser.selectedTime == formattedTime && timeBooked.includes(currUser.selectedTime))
        {
            slotButton.classList.add("selected");
        }
        else if (timeBooked.includes(formattedTime)) {
            slotButton.classList.add("booked");
            slotButton.disabled = true;
        }

        showDate.textContent = `Date: ${date}`;

        slotContainer.appendChild(slotButton);

        currentMinute += duration;
        if (currentMinute >= 60) {
            currentHour += 1;
            currentMinute %= 60;
        }
    }

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear";
    clearBtn.type = "button";
    clearBtn.classList.add("clear-btn");
    slotContainer.appendChild(clearBtn);


    const slotButtons = document.querySelectorAll(".time-slot");

    slotButtons.forEach(button => {
        button.addEventListener("click", () => {
            slotButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            saveBtn.disabled = false;
            saveBtn.style.cursor = "pointer";
            selectedTime = button.value;
            saveBtn.style.backgroundColor = "#007bff";

        })
    })

    clearBtn.addEventListener("click", () => {
        const slotButtons = document.querySelectorAll(".time-slot");
        slotButtons.forEach(btn => btn.classList.remove("selected"));
        selectedTime = null;
        saveBtn.disabled = true;
        saveBtn.style.cursor = "not-allowed";
        saveBtn.style.backgroundColor = "#e0e0e0";
    });
}

dateBtn.addEventListener("change", () => {
    errorMsg.style.display = "none";
    generateTimeSlots(dateBtn.value);
    legendDiv.style.display = "flex";
})

function addDetails() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const number = document.getElementById("number").value;
    const services = document.getElementById("services").value;
    const currDate = document.getElementById("date").value;


    if (validateForm()) {

        if (isEdit) {
            userBooking.forEach(booking => {
                const date = booking.date;
                if (booking.id == editIndex) {
                    if (!bookingsByDate[currDate]) {
                        bookingsByDate[currDate] = [];
                    }
                    if (bookingsByDate[date].includes(booking.selectedTime)) {
                        bookingsByDate[date] = bookingsByDate[date].filter(time => time != booking.selectedTime)
                        bookingsByDate[currDate].push(selectedTime);
                    }
                    else {
                        bookingsByDate[currDate].push(selectedTime);
                    }

                    booking.name = name;
                    booking.email = email;
                    booking.number = number;
                    booking.services = services;
                    booking.date = currDate;
                    booking.selectedTime = selectedTime;
                }
            })
            localStorage.setItem("userBooking", JSON.stringify(userBooking));
            localStorage.setItem("bookingsByDate", JSON.stringify(bookingsByDate));
        }

        else {
            if (!bookingsByDate[currDate]) {
                bookingsByDate[currDate] = [];
            }

            bookingsByDate[currDate].push(selectedTime);

            localStorage.setItem("bookingsByDate", JSON.stringify(bookingsByDate));

            userBooking.push({
                id: crypto.randomUUID(),
                name: name,
                email: email,
                number: number,
                services: services,
                date: currDate,
                selectedTime: selectedTime,
            })
            localStorage.setItem("userBooking", JSON.stringify(userBooking));
            localStorage.removeItem("service");
        }
        return true;
    }
    else {
        return false;
    }
}

function validateForm() {
    let isValid = true;
    if(!isValidName()) isValid = false; 
    if(!isValidEmail()) isValid = false; 
    if(!isValidNumber()) isValid = false; 
    if(!isValidService()) isValid = false; 

    return isValid;
}

function isValidName(){
    let isValid = true;
    const name = document.getElementById("name").value;
    let nameRegex = /^[a-zA-Z0-9]{2,}/;

    if (name == "" || name.length == 0) {
        isValid = false;
        document.getElementById("name-error").textContent = "Name should not be empty";
        document.getElementById("name-error").style.display = "flex";
    }
    else if (!nameRegex.test(name)) {
        isValid = false;
        document.getElementById("name-error").textContent = "Name should contains atleast 2 letters";
        document.getElementById("name-error").style.display = "flex";
    }

    if (name.length > 0 && nameRegex.test(name)) document.getElementById("name-error").style.display = "none";

    return isValid;
}

function isValidEmail(){
    let isValid = true;
    const email = document.getElementById("email").value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email == "" || email.length == 0) {
        isValid = false;
        document.getElementById("email-error").textContent = "Email should not be empty";
        document.getElementById("email-error").style.display = "flex";
    }
    else if (!emailRegex.test(email)) {
        isValid = false;
        document.getElementById("email-error").textContent = "Please enter valid email";
        document.getElementById("email-error").style.display = "flex";
    }

    if (emailRegex.test(email.trim())) document.getElementById("email-error").style.display = "none";

    return isValid;
}

function isValidNumber(){
    let isValid = true;
    const number = document.getElementById("number").value;
    const numberRegex = /^\d{10}$/;
    if (number == '' || number.length == 0) {
        isValid = false;
        document.getElementById("number-error").textContent = "Number should not be empty";
        document.getElementById("number-error").style.display = "flex";
    }
    else if (!numberRegex.test(number)) {
        isValid = false;
        document.getElementById("number-error").textContent = "Number should have 10 digits";
        document.getElementById("number-error").style.display = "flex";
    }

    if (numberRegex.test(number.trim())) document.getElementById("number-error").style.display = "none";

    return isValid;
}

function isValidService(){
    let isValid = true; 
    const services = document.getElementById("services").value;
    if (services == "" || services.length == 0) {
        isValid = false;
        document.getElementById("services-error").textContent = "Select the services category";
        document.getElementById("services-error").style.display = "flex";
    }
    else if (services.trim().length > 0) document.getElementById("services-error").style.display = "none";

    return isValid;
}

document.getElementById("name").addEventListener("blur", () => {
    isValidName();
});

document.getElementById("email").addEventListener("blur", () => {
    isValidEmail();
});

document.getElementById("number").addEventListener("blur", () => {
    isValidNumber();
});

document.getElementById("services").addEventListener("blur", () => {
    isValidService();   
});


function reschedule() {
    isEdit = true;
    let validId = false;
    userBooking.forEach(booking => {
        if (booking.id == editIndex) {
            document.getElementById("name").value = booking.name;
            document.getElementById("email").value = booking.email;
            document.getElementById("number").value = booking.number;
            document.getElementById("services").value = booking.services;
            document.getElementById("date").value = booking.date;

            currUser = booking;
            generateTimeSlots(booking.date);
            errorMsg.style.display = "none";

            document.getElementById("form-header").textContent = "Update Appointment"
            saveBtn.textContent = "Update"

            validId = true;
        }
    })
    if (!validId) {
        document.getElementById("error-div-id").style.display = "flex";
        form.style.display = "none";
        idError.style.display = "flex";
    }
    modal.style.display = "flex";
}

window.onload = () => {
    idURL = window.location.href;
    errorMsg.style.display = "flex";
    if (idURL.includes("?")) {
        editIndex = idURL.split("?")[1];
        reschedule();
    }
    saveBtn.disabled = true;
    saveBtn.style.backgroundColor = "#e0e0e0"
    if(localStorage.getItem("service")){
        tempServices = localStorage.getItem("service");
        document.getElementById("services").value = tempServices;
    }
    else{
        document.getElementById.value = "";
    }
}
