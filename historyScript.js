const emptyHistoryMsg = document.getElementById("emptyHistoryMsg");
const userBooking = JSON.parse(localStorage.getItem("userBooking")) || [];
const home = document.getElementById("home");
const historyTableBody = document.getElementById("historyTableBody");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const modal = document.getElementById("modal");

console.log(userBooking)

home.addEventListener("click", () => {
    window.location.href = "index.html";
});

window.onload = () => {
    if(userBooking.length === 0) {
        emptyHistoryMsg.style.display = "flex";
        return;
    }
    emptyHistoryMsg.style.display = "none";
    renderTable();
}

function renderTable() {
    historyTableBody.innerHTML = "";
    userBooking.forEach(booking => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>${booking.services}</td>
            <td>${booking.date}</td>
            <td>${booking.selectedTime}</td>
            <td>
            <button type="button" class="cancel-booking-btn" onclick="cancelBooking(${userBooking.indexOf(booking)})">Cancel</button>
            <a href = "index.html?${booking.id}">
                <button type="button" class="reschedule-booking-btn">Reschedule</button>
            </a>
            </td>
        `;
        historyTableBody.appendChild(row);
    });
}

function cancelBooking(index) {
    userBooking.splice(index, 1);
    localStorage.setItem("userBooking", JSON.stringify(userBooking));
    renderTable();
    if(userBooking.length === 0) {
        emptyHistoryMsg.style.display = "flex";
    }
}
