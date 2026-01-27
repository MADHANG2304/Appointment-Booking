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
        number: "9363234339",
        services: "Consultant",
        date: "2026-01-27",
        selectedTime: "11:00"
    },
    {
        id: 3,
        name: "Anitha",
        email: "anitha@gmail.com",
        number: "9876543210",
        services: "CheckUp",
        date: "2026-01-28",
        selectedTime: "10:00"
    },
    {
        id: 2,
        name: "Rahul",
        email: "rahul2306@gmail.com",
        number: "8667727297",
        services: "Full Body Checkup",
        date: "2026-01-27",
        selectedTime: "12:00"
    },
    {
        id: 4,
        name: "Karthik",
        email: "karthik@gmail.com",
        number: "9123456789",
        services: "CheckUp",
        date: "2026-01-28",
        selectedTime: "11:30"
    },
    {
        id: 6,
        name: "Suresh",
        email: "suresh@gmail.com",
        number: "9345678123",
        services: "Consultant",
        date: "2026-01-29",
        selectedTime: "12:00"
    },
    {
        id: 7,
        name: "Divya",
        email: "divya@gmail.com",
        number: "9567890123",
        services: "CheckUp",
        date: "2026-01-30",
        selectedTime: "10:30"
    },
    {
        id: 5,
        name: "Priya",
        email: "priya@gmail.com",
        number: "9012345678",
        services: "Consultant",
        date: "2026-01-29",
        selectedTime: "10:00"
    },
    {
        id: 8,
        name: "Arun",
        email: "arun@gmail.com",
        number: "9789012345",
        services: "Full Body Checkup",
        date: "2026-01-30",
        selectedTime: "13:00"
    },
    {
        id: 9,
        name: "Meena",
        email: "meena@gmail.com",
        number: "9890123456",
        services: "Full Body Checkup",
        date: "2026-01-31",
        selectedTime: "10:30"
    },
    {
        id: 10,
        name: "Vijay",
        email: "vijay@gmail.com",
        number: "9001234567",
        services: "CheckUp",
        date: "2026-01-31",
        selectedTime: "11:30"
    }
];

const bookingsByDate = JSON.parse(localStorage.getItem("bookingsByDate")) || {};

// function hideAll() {
//     slotContainer.innerHTML = "";
//     errorMsg.style.display = "flex";
//     form.reset();
// }

slotBook.addEventListener("click", () => {
    window.location.href = "form.html";
    // hideAll();
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
}
