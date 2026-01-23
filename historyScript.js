const emptyHistoryMsg = document.getElementById("emptyHistoryMsg");
let userBooking = JSON.parse(localStorage.getItem("userBooking")) || [];
let bookingsByDate = JSON.parse(localStorage.getItem("bookingsByDate")) || [];
const home = document.getElementById("home");
const historyTableBody = document.getElementById("historyTableBody");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const modal = document.getElementById("modal");
const applyBtn = document.getElementById("apply-filter");

home.addEventListener("click", () => {
    window.location.href = "index.html";
});

window.onload = () => {
    userBooking = JSON.parse(localStorage.getItem("userBooking"));
    bookingsByDate = JSON.parse(localStorage.getItem("bookingsByDate"));
    if ( userBooking == null || userBooking.length === 0) {
        emptyHistoryMsg.style.display = "flex";
        applyBtn.style.cursor = "not-allowed"
        return;
    }
    if (userBooking.length === 0) {
        emptyHistoryMsg.style.display = "flex";
        localStorage.removeItem("userBooking");
    }
    else{
        applyBtn.style.cursor = "pointer";
    }
    emptyHistoryMsg.style.display = "none";
    generateTable();
}

function generateTable() {
    historyTableBody.innerHTML = "";
    userBooking.forEach(booking => {
        renderTable(booking);
    })
}

function renderTable(booking) {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>${booking.services}</td>
            <td>${booking.date}</td>
            <td>${booking.selectedTime}</td>
            <td>${booking.number}</td>
            <td>
            <button type="button" class="cancel-booking-btn" onclick="cancelBooking(${booking.id})">Cancel</button>
            <a href = "form.html?${booking.id}">
                <button type="button" class="reschedule-booking-btn">Reschedule</button>
            </a>
            </td>
        `;
    historyTableBody.appendChild(row);
}

function cancelBooking(index) {
    let date;
    let selectedTime;
    userBooking.forEach(booking => {
        if (booking.id == index) {
            date = booking.date;
            selectedTime = booking.selectedTime;
        }
    })

    userBooking = userBooking.filter((booking) => booking.id != index)
    localStorage.setItem("userBooking", JSON.stringify(userBooking));

    bookingsByDate[date] = bookingsByDate[date].filter(time => time != selectedTime);
    localStorage.setItem("bookingsByDate", JSON.stringify(bookingsByDate));

    generateTable();

    if (userBooking.length === 0) {
        emptyHistoryMsg.style.display = "flex";
        localStorage.removeItem("userBooking");
        applyBtn.style.cursor = "not-allowed"
    }
    else{
        applyBtn.style.cursor = "pointer";
    }

    Object.keys(bookingsByDate).forEach(date => {
        if (bookingsByDate[date].length === 0) {
            console.log("deleted");
            delete bookingsByDate[date];
        }
    })  

    if (Object.keys(bookingsByDate).length == 0) {
        localStorage.removeItem("bookingsByDate");
    }
    else {
        localStorage.setItem("bookingsByDate", JSON.stringify(bookingsByDate));
    }
}


applyBtn.onclick = () => {
    const date = document.getElementById("date").value;
    const services = document.getElementById("services").value;


    let isFound = false;

    historyTableBody.innerHTML = "";

    if (date == "none" && services == "none") {
        alert("Filter should be filled!");
        emptyHistoryMsg.style.display = "none"
        isFound = true
        generateTable();
    }
    else if (date == "none" && services == "") {
        alert("Filter should be filled!");
        emptyHistoryMsg.style.display = "none"
        isFound = true
        generateTable();
    }
    else if (date == "" && services == "none") {
        alert("Filter should be filled!");
        emptyHistoryMsg.style.display = "none"
        isFound = true
        generateTable();
    }

    if (date == "" && services == "") {
        emptyHistoryMsg.style.display = "none"
        generateTable();
    }

    else if (date != "" && (services == "" || services == "none")) {
        emptyHistoryMsg.style.display = "none"
        userBooking.forEach(booking => {
            if (booking.date == date) {
                renderTable(booking);
                isFound = true;
            }
        })
    }
    else if ((date == "" || date == "none") && services != "") {
        emptyHistoryMsg.style.display = "none"
        userBooking.forEach(booking => {
            if (booking.services == services) {
                renderTable(booking);
                isFound = true
            }
        })
    }

    else if (date != "" && services != "") {
        emptyHistoryMsg.style.display = "none"
        userBooking.forEach(booking => {
            if (booking.date == date && booking.services == services) {
                renderTable(booking);
                isFound = true;
            }
        })
    }

    if (!isFound) {
        emptyHistoryMsg.style.display = "flex"
        isFound = false;
    }
}
