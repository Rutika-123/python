console.log("✅ script.js loaded");

let currentUpdateId = null;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addBtn").addEventListener("click", addItem);
    loadItems();
});

async function loadItems() {
    const res = await fetch("/items");
    const items = await res.json();

    const tbody = document.querySelector("#items-table tbody");
    tbody.innerHTML = "";

    items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>
                <button onclick="showUpdateForm(${item.id}, '${item.name}', '${item.description}')">Update</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function addItem() {
    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    if (!name || !description) {
        errorMessage.textContent = "Please fill in both the name and description fields.";
        errorMessage.style.display = "block";
        return;
    }

    errorMessage.style.display = "none";

    const res = await fetch("/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
    });

    if (res.ok) {
        document.getElementById("name").value = "";
        document.getElementById("description").value = "";
        loadItems();
    } else {
        console.error("❌ Failed to add item");
        errorMessage.textContent = "Failed to add item. Please try again.";
        errorMessage.style.display = "block";
    }
}

function showUpdateForm(id, name, description) {
    currentUpdateId = id;
    document.getElementById("updateName").value = name;
    document.getElementById("updateDescription").value = description;
    document.getElementById("updateForm").style.display = "block";
}

async function saveUpdate() {
    const name = document.getElementById("updateName").value;
    const description = document.getElementById("updateDescription").value;

    await fetch(`/items/${currentUpdateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
    });

    document.getElementById("updateForm").style.display = "none";
    currentUpdateId = null;
    loadItems();
}

function cancelUpdate() {
    document.getElementById("updateForm").style.display = "none";
    currentUpdateId = null;
}

async function deleteItem(id) {
    await fetch(`/items/${id}`, { method: "DELETE" });
    loadItems();
}
