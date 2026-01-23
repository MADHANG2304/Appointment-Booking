const dateBtn = document.getElementById("date");
const slotContainer = document.getElementById("slots-container");
const modal = document.getElementById("modal");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const slotBook = document.getElementById("slotBook");
const bookSlot = document.getElementById("bookSlot");
const slotHistory = document.getElementById("history");
const form = document.getElementById("detailsForm");
const errorMsg = document.getElementById("error-msg");

const userBooking = [
    {
        id: 1,
        name: "Madhan",
        email: "madhang2306@gmail.com",
        number:"9363234339",
        services: "Consultant",
        date: "2026-01-23",
        selectedTime: "11:00"
    },
    {
        id: 2,
        name: "Rahul",
        email: "rahul2306@gmail.com",
        number:"8667727297",
        services: "Full Body Checkup",
        date: "2026-01-24",
        selectedTime: "11:30"
    },
];

const bookingsByDate = JSON.parse(localStorage.getItem("bookingsByDate")) || {};

function hideAll() {
    slotContainer.innerHTML = "";
    errorMsg.style.display = "flex";
    form.reset();
}

slotBook.addEventListener("click", () => {
    window.location.href = "form.html";
    hideAll();
})

bookSlot.onclick = () => {
    window.location.href = "form.html";
    hideAll();
}

slotHistory.addEventListener("click", () => {
    window.location.href = "historyTable.html";
});


window.onload = () => {

    if(localStorage.getItem("userBooking") === null)
    {
        if (userBooking.length > 0) {
            userBooking.forEach(booking => {
                const { date, selectedTime } = booking;
    
                if (!bookingsByDate[date]) {
                    bookingsByDate[date] = [];
                }
    
                if (!bookingsByDate[date].includes(selectedTime)) {
                    bookingsByDate[date].push(selectedTime);
                }
            })
            localStorage.setItem("bookingsByDate", JSON.stringify(bookingsByDate));
            localStorage.setItem("userBooking", JSON.stringify(userBooking));
        }
    }


    idURL = window.location.href;
    if (idURL.includes("?")) {
        editIndex = idURL.split("?")[1];
        reschedule();
    }
}
