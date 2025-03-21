const API_URL = "https://ls5zx6mo46.execute-api.us-east-1.amazonaws.com/dev";
//const API_URL = "http://localhost:8081";


// Función para alternar entre Iniciar Sesión y Registrarse
function toggleForm() {
    const formTitle = document.getElementById("formTitle");
    const submitButton = document.querySelector("button");
    const toggleText = document.getElementById("toggleForm");

    if (formTitle.innerText === "Iniciar Sesión") {
        formTitle.innerText = "Registrarse";
        submitButton.innerText = "Registrarse";
        toggleText.innerHTML = "¿Ya tienes cuenta? <a href='#' onclick='toggleForm()'>Inicia sesión aquí</a>";
    } else {
        formTitle.innerText = "Iniciar Sesión";
        submitButton.innerText = "Iniciar Sesión";
        toggleText.innerHTML = "¿No tienes cuenta? <a href='#' onclick='toggleForm()'>Regístrate aquí</a>";
    }
}

// Manejo del formulario
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("authForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (document.getElementById("formTitle").innerText === "Iniciar Sesión") {
            login(email, password);
        } else {
            register(email, password);
        }
    });
});

// Función de inicio de sesión
async function login(email, password) {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const token = await response.text();  // Leer como texto en lugar de JSON
        localStorage.setItem("token", token); // Guardar el token
        window.location.href = "home.html";   // Redirigir al usuario
    } else {
        alert("Credenciales incorrectas");
    }
}


// Función de registro
async function register(email, password) {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Nombre",  // Puedes modificarlo para obtener valores desde un input
            lastName: "Apellido",
            email,
            password
        })
    });

    if (response.ok) {
        alert("Registro exitoso. Ahora puedes iniciar sesión");
        toggleForm();
    } else {
        const errorData = await response.json();
        alert(errorData.message || "Error en el registro");
    }
}

// Función para crear un Stream
async function createStream() {
    const creator = document.getElementById("creator").value;
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/stream`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ creator })
    });

    if (response.ok) {
        const stream = await response.json();
        alert(`Stream creado con nombre: ${stream.creator}`);
    } else {
        alert("Error al crear el Stream");
    }
}

// Función para crear un Post
async function createPost() {
    const streamId = document.getElementById("streamId").value;
    const creator = document.getElementById("creatorPost").value;
    const content = document.getElementById("content").value;
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/post`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ creator, content, streamId })
    });

    if (response.ok) {
        const post = await response.json();
        alert(`Post creado por: ${post.creator}`);
    } else {
        alert("Error al crear el Post");
    }
}

// Función para obtener Posts de un Stream
async function getPosts() {
    const streamId = document.getElementById("streamNamePosts").value;
    console.log(streamId);
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/stream/${streamId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.ok) {
        const stream = await response.json();
        const postsTable = document.getElementById("postsTable").getElementsByTagName("tbody")[0];
        postsTable.innerHTML = "";

        stream.posts.forEach(post => {
            const row = postsTable.insertRow();
            row.insertCell(0).textContent = post.creator;
            row.insertCell(1).textContent = post.content;
            row.insertCell(2).textContent = post.date;
        });
    } else {
        alert("Error al obtener los Posts");
    }
}
