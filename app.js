const API_URL = "http://localhost:8081";

async function createStream() {
    const creator = document.getElementById("creator").value;

    const response = await fetch(`${API_URL}/stream`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ creator }),
    });

    if (response.ok) {
        const stream = await response.json();
        alert(`Stream creado con nombre: ${stream.creator}`);
    } else {
        alert("Error al crear el Stream");
    }
}

async function createPost() {
    const streamId = document.getElementById("streamId").value;
    const creator = document.getElementById("creatorPost").value;
    const content = document.getElementById("content").value;

    const response = await fetch(`${API_URL}/post`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ creator, content, streamId }),
    });

    if (response.ok) {
        const post = await response.json();
        alert(`Post creado por: ${post.creator}`);
    } else {
        alert("Error al crear el Post");
    }
}

async function getPosts() {
    const streamId = document.getElementById("streamNamePosts").value;

    const response = await fetch(`${API_URL}/stream/${streamId}`);
    if (response.ok) {
        const stream = await response.json();
        const postsTable = document.getElementById("postsTable").getElementsByTagName("tbody")[0];
        postsTable.innerHTML = ""; // Limpiar la tabla

        stream.posts.forEach(post => {
            const row = postsTable.insertRow();
            const cellCreator = row.insertCell(0);
            const cellContent = row.insertCell(1);
            const cellDate = row.insertCell(2);

            cellCreator.textContent = post.creator;
            cellContent.textContent = post.content;
            cellDate.textContent = post.date;
        });
    } else {
        alert("Error al obtener los Posts");
    }
}