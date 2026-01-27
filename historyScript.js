const emptyHistoryMsg = document.getElementById("emptyHistoryMsg");
let userBooking = JSON.parse(localStorage.getItem("userBooking")) || [];
let bookingsByDate = JSON.parse(localStorage.getItem("bookingsByDate")) || [];
const home = document.getElementById("home");
const historyTableBody = document.getElementById("historyTableBody");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const modal = document.getElementById("modal");
const applyBtn = document.getElementById("apply-filter");

let completedDate = [];

home.addEventListener("click", () => {
    window.location.href = "index.html";
});

window.onload = () => {
    userBooking = JSON.parse(localStorage.getItem("userBooking"));
    bookingsByDate = JSON.parse(localStorage.getItem("bookingsByDate"));

    makeOrder();
    localStorage.setItem("userBooking", JSON.stringify(userBooking));

    if (userBooking == null || userBooking.length === 0) {
        emptyHistoryMsg.style.display = "flex";
        applyBtn.style.cursor = "not-allowed"
        return;
    }
    if (userBooking.length === 0) {
        emptyHistoryMsg.style.display = "flex";
        localStorage.removeItem("userBooking");
    }
    else {
        applyBtn.style.cursor = "pointer";
    }
    emptyHistoryMsg.style.display = "none";
    generateTable();
}

function makeOrder() {
    if(userBooking != null)
    {
        userBooking.sort((a, b) => {
            const x = new Date(a.date);
            const y = new Date(b.date);
    
            return x - y;
        })
    }
}

function generateTable() {
    completedDate = [];

    historyTableBody.innerHTML = "";
    userBooking.forEach(booking => {
        if (!completedDate.includes(booking.date)) {
            const [year, month, day] = booking.date.split("-");
            const temp = document.createElement("tr");
            temp.innerHTML = `
                <td colspan="7" class="appointment-date">
                    ${day}-${month}-${year}
                </td>
            `;
            historyTableBody.appendChild(temp);
            completedDate.push(booking.date);
        }
        renderTable(booking);
    })
}

function renderTable(booking) {
    const row = document.createElement("tr");
    const [year, month, day] = booking.date.split("-");
    row.innerHTML = `
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>${booking.services}</td>
            <td>${day}-${month}-${year}</td>
            <td>${booking.selectedTime}</td>
            <td>${booking.number}</td>
            <td>
            <button type="button" class="cancel-booking-btn" onclick="cancelBooking(${booking.id})">Cancel</button>
            <a href = "form.html?${booking.id}">
                <button type="button" class="reschedule-booking-btn">Reschedule</button>
            </a>
            <button class="action-btn" aria-label="Update and Delete">
            <button class="btns" onclick="cancelBooking(${booking.id})"><i class="fa fa-trash"></i></button>
            <a href = "form.html?${booking.id}">
                <button class="btns"><i class="fa fa-edit"></i></button>
            </a>
            </button>
            </td>
        `;
    historyTableBody.appendChild(row);
}

function cancelBooking(index) {

    if (confirm("Please confirm deleting the data!")) {
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
        else {
            applyBtn.style.cursor = "pointer";
        }

        Object.keys(bookingsByDate).forEach(date => {
            if (bookingsByDate[date].length === 0) {
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

}


applyBtn.onclick = () => {
    const date = document.getElementById("date").value;
    const services = document.getElementById("services").value;
    let isFound = false;
    if(userBooking != null && userBooking.length != 0)
    {
        historyTableBody.innerHTML = "";
    
        if (date == "none" && services == "none") {
            alert("Filter should be selected!");
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
    }

    if (!isFound) {
        emptyHistoryMsg.style.display = "flex"
        isFound = false;
    }
}
