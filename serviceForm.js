const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const errorMsg = document.getElementById("error-msg");

cancelBtn.onclick = () => {
    window.location.href = "index.html"
}

saveBtn.onclick = () => {
    const service = document.getElementById("services").value;
    if(service != "" && service.length > 0)
    {
        localStorage.setItem("service" , service);
        errorMsg.style.display = "none";
        window.location.href = "form.html";
    }
    else{
        errorMsg.style.display = "flex";
    }
}

document.getElementById("services").onchange = () => {
    const service = document.getElementById("services").value;
    if(service != "" && service.length > 0)
    {
        errorMsg.style.display = "none";
    }
    else{
        errorMsg.style.display = "flex";
    }
}
