const dateBtn = document.getElementById("date");
const slotContainer = document.getElementById("slots-container");
const modal = document.getElementById("modal");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const slotBook = document.getElementById("slotBook");
const slotHistory = document.getElementById("history");
const form = document.getElementById("detailsForm");
const errorMsg = document.getElementById("error-msg");
const showDate = document.getElementById("show-date");
const legendDiv = document.getElementById("legend");
const formError = document.getElementById("form-error");

const userBooking = JSON.parse(localStorage.getItem("userBooking")) || [];

const bookingsByDate = JSON.parse(localStorage.getItem("bookingsByDate")) || {};


let selectedTime = null;
let idURL;
let isEdit = false;
let editIndex;

function hideAll() {
    slotContainer.innerHTML = "";
    errorMsg.style.display = "flex";
    legendDiv.style.display = "none"
    form.reset();
}

slotBook.addEventListener("click", () => {
    modal.style.display = "flex";
    saveBtn.disabled = true;
    saveBtn.style.cursor = "not-allowed";
    hideAll();
})

slotHistory.addEventListener("click", () => {
    window.location.href = "historyTable.html";
});

cancelBtn.onclick = () => {
    legendDiv.style.display = "none"
    modal.style.display = "none";
    if (window.location.href.includes("?")) {
        console.log(1)
        window.location.href = "historyTable.html";
    }
    else if (window.location.href === "http://127.0.0.1:5500/form.html") {
        console.log(2)
        window.location.href = "index.html";
    }
    console.log(window.location.href)
}

saveBtn.onclick = () => {
    if (addDetails()) {
        window.location.href = "historyTable.html"
        form.reset();
        modal.style.display = "none";
    }
}

errorMsg.style.display = "flex";
const startHour = 10;
const endHour = 18;
const duration = 30;


function generateTimeSlots(date) {
    slotContainer.innerHTML = "";

    const timeBooked = bookingsByDate[date] || [];
    
    if(bookingsByDate[date].length == 17)
    {
        document.getElementById("slot-error").style.display = "flex";
        document.getElementById("slots-container").style.display = "none";
        return;
    }

    let currentHour = startHour;
    let currentMinute = 0;
    while (currentHour < endHour || (currentHour === endHour && currentMinute === 0)) {
        const time = new Date();
        time.setHours(currentHour, currentMinute, 0, 0);

        const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


        const slotButton = document.createElement("button");
        slotButton.value = formattedTime;
        slotButton.textContent = formattedTime;
        slotButton.classList.add('time-slot');
        slotButton.type = "button";

        if (timeBooked.includes(formattedTime)) {
            slotButton.classList.add("booked");
            slotButton.disabled = true;
        }

        showDate.textContent = `Date: ${date}`;

        slotContainer.appendChild(slotButton);

        currentMinute += duration;
        if (currentMinute >= 60) {
            currentHour += Math.floor(currentMinute / 60);
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
        })
    })

    clearBtn.addEventListener("click", () => {
        const slotButtons = document.querySelectorAll(".time-slot");
        slotButtons.forEach(btn => btn.classList.remove("selected"));
        selectedTime = null;
        saveBtn.disabled = true;
        saveBtn.style.cursor = "not-allowed";
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
    if (validateForm(name, email, number, services)) {

        if (isEdit) {
            userBooking.forEach(booking => {
                const date = booking;

                if (booking.id == editIndex) {
                    if (!bookingsByDate[date]) {
                        bookingsByDate[date] = [];
                    }
                    if (bookingsByDate[date].includes(booking.selectedTime)) {
                        bookingsByDate[date] = bookingsByDate[date].filter(time => time != booking.selectedTime)
                        bookingsByDate[date].push(selectedTime);
                    }
                    else {
                        bookingsByDate[date].push(selectedTime);
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
                id: userBooking.length + 1,
                name: name,
                email: email,
                number: number,
                services: services,
                date: currDate,
                selectedTime: selectedTime,
            })
            localStorage.setItem("userBooking", JSON.stringify(userBooking));
        }
        return true;
    }
    else {
        formError.style.display = "flex";
        formError.textContent = "All Fields should be filled Correctly";
        return false;
    }
}

function validateForm(name, email, number, services) {
    let isValid = true;
    let nameRegex = /^[a-zA-Z0-9]+/;
    if (!nameRegex.test(name)) {
        isValid = false;
        document.getElementById("name-error").textContent = "Please enter valid Name";
        document.getElementById("name-error").style.display = "flex";
    }

    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        isValid = false;
        document.getElementById("email-error").textContent = "Please enter valid email";
        document.getElementById("email-error").style.display = "flex";
    }

    let numberRegex = /^\d{10}$/;
    if (!numberRegex.test(number)) {
        isValid = false;
        document.getElementById("number-error").textContent = "Number should have 10 digits";
        document.getElementById("number-error").style.display = "flex";
    }

    if (services == "" || services.length == 0) {
        isValid = false;
        document.getElementById("services-error").textContent = "Select the services category";
        document.getElementById("services-error").style.display = "flex";
    }

    return isValid;
}


function reschedule() {
    isEdit = true;
    userBooking.forEach(booking => {
        if (booking.id == editIndex) {
            document.getElementById("name").value = booking.name;
            document.getElementById("email").value = booking.email;
            document.getElementById("number").value = booking.number;
            document.getElementById("services").value = booking.services;
            document.getElementById("date").value = booking.date;
        }
    })
    modal.style.display = "flex";
}


window.onload = () => {
    idURL = window.location.href;
    if (idURL.includes("?")) {
        editIndex = idURL.split("?")[1];
        reschedule();
    }
}
