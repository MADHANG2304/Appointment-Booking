const dateBtn = document.getElementById("date");
const slotContainer = document.getElementById("slots-container");
const modal = document.getElementById("modal");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const slotBook = document.getElementById("slotBook");
const slotHistory = document.getElementById("history");
const form = document.getElementById("detailsForm");
const errorMsg = document.getElementById("error-msg");
// const emptyHistoryMsg = document.getElementById("emptyHistoryMsg");

const userBooking = JSON.parse(localStorage.getItem("userBooking")) || [];
const bookingsByDate = JSON.parse(localStorage.getItem("bookingsByDate")) || {};

let selectedTime = null;

function hideAll() {
    slotContainer.innerHTML = "";
    errorMsg.style.display = "flex";
    form.reset();
}

slotBook.addEventListener("click", () => {
    modal.style.display = "flex";
    hideAll();
})

slotHistory.addEventListener("click", () => {
    window.location.href = "historyTable.html";
    // renderTable();
});

cancelBtn.onclick = () => {
    modal.style.display = "none";
}

saveBtn.onclick = () => {
    addDetails();
    // renderTable();
    form.reset();
    modal.style.display = "none";
}

errorMsg.style.display = "flex";
const startHour = 10;
const endHour = 18;
const duration = 30;


function generateTimeSlots(date) {
    slotContainer.innerHTML = "";
    
    const timeBooked = bookingsByDate[dateBtn.value] || [];
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
})

function addDetails() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const services = document.getElementById("services").value;
    const date = document.getElementById("date").value;

    if (!bookingsByDate[date]) {
        bookingsByDate[date] = [];
    }

    bookingsByDate[date].push(selectedTime);

    localStorage.setItem("bookingsByDate", JSON.stringify(bookingsByDate));
    let len = userBooking.length;
    len += 1
    
    userBooking.push({
        id:len,
        name:name,
        email:email,
        services:services,
        date:date,
        selectedTime:selectedTime,
    })
    localStorage.setItem("userBooking", JSON.stringify(userBooking));
}

// function renderTable() {
//     const historyTableBody = document.getElementById("historyTableBody");
//     historyTableBody.innerHTML = "";
//     userBooking.forEach(booking => {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${booking.name}</td>
//             <td>${booking.email}</td>
//             <td>${booking.services}</td>
//             <td>${booking.date}</td>
//             <td>${booking.selectedTime}</td>
//             <td>
//             <button type="button" class="cancel-booking-btn">Cancel</button>
//             <button type="button" class="reschedule-booking-btn">Reschedule</button>
//             </td>
//         `;
//         historyTableBody.appendChild(row);
//     });
// }


window.onload = () => {
    localStorage.removeItem("bookingsByDate");
    localStorage.removeItem("userBooking");
    let url = window.location.href;
}
