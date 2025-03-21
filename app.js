const API_URL = "https://ls5zx6mo46.execute-api.us-east-1.amazonaws.com/dev";
//const API_URL = "http://localhost:8081";

// Obtener datos del usuario después de iniciar sesión
async function fetchUserData(email) {
    const response = await fetch(`${API_URL}/user/email/${email}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    if (response.ok) {
        const user = await response.json();
        localStorage.setItem("userName", user.name);
    } else {
        alert("No se pudo obtener la información del usuario.");
    }
}

function toggleForm() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }
}

// Función de inicio de sesión
async function login(email, password) {
    try {

        const response = await fetch(`${API_URL}/api/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {  
            const token = await response.text();
            
            localStorage.setItem("token", token);
            localStorage.setItem("userEmail", email);
            
            await fetchUserData(email); // Obtener datos del usuario
            setTimeout(() => {
                window.location.href = "home.html";
            }, 500);
        } else {
            const errorText = await response.text();
            console.error("❌ Error al iniciar sesión:", errorText);
            alert("⚠️ Credenciales incorrectas.");
        }
    } catch (error) {
        console.error("Error en login:", error);
    }
}

// Función de registro
async function register(email, name, password) {
    try {

        const response = await fetch(`${API_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, password })
        });

        const data = await response.text(); // Captura la respuesta del servidor

        if (response.ok) {
            alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
            window.location.href = "index.html"; // Redirigir al login
        } else {
            alert(`⚠️ Error en el registro: ${data}`);
        }
    } catch (error) {
        console.error("❌ Error en el registro:", error);
        alert("❌ Hubo un problema con el registro.");
    }
}



// Función para obtener la lista de Streams como botones
async function getStreams() {
    const token = localStorage.getItem("token");

    if (!token) {
        return; // No hacer la petición si no hay token
    }

    const response = await fetch(`${API_URL}/stream`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
        const streams = await response.json();
        const container = document.getElementById("streamsContainer");
        container.innerHTML = ""; // Limpiar contenido anterior

        streams.forEach(stream => {
            const button = document.createElement("button");
            button.textContent = stream.creator;
            button.classList.add("stream-button");
            button.onclick = () => loadPosts(stream.id);
            container.appendChild(button);
        });
    } else {
        alert("Error al obtener los Streams");
    }
}

// Función para cargar los posts de un stream seleccionado
async function loadPosts(streamId) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/stream/${streamId}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Error al cargar los posts.");
        }

        const stream = await response.json();
        
        // Verifica si 'posts' existe y es un array
        const posts = Array.isArray(stream.posts) ? stream.posts : [];

        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = ""; // Limpiar contenido anterior

        if (posts.length === 0) {
            postsContainer.innerHTML = "<p>No hay posts en este stream.</p>";
        } else {
            posts.forEach(post => {
                const postElement = document.createElement("p");
                postElement.innerHTML = `<strong>${post.creator}:</strong> ${post.content} <br> <small>${post.date}</small>`;
                postsContainer.appendChild(postElement);
            });
        }

        // Mostrar la sección de posts y el botón de crear post
        document.getElementById("postSection").style.display = "block";
        document.getElementById("createPostButton").onclick = () => createPost(streamId);

    } catch (error) {
        console.error("Error en loadPosts:", error);
        alert("No se pudieron cargar los posts.");
    }
}


// Función para crear un Post en el Stream seleccionado
async function createPost(streamId) {
    const creator = localStorage.getItem("userName");
    const content = prompt("Escribe tu post:");
    const token = localStorage.getItem("token");

    if (!creator) {
        alert("No se ha encontrado el nombre del usuario. Intenta iniciar sesión nuevamente.");
        return;
    }

    if (!content) {
        alert("El contenido del post no puede estar vacío.");
        return;
    }

    const response = await fetch(`${API_URL}/post`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ creator, content, streamId })
    });

    if (response.ok) {
        loadPosts(streamId); // Actualizar los posts del stream
    } else {
        alert("Error al crear el Post");
    }
}

// Función para crear un Stream
async function createStream() {
    const creator = localStorage.getItem("userName"); // Obtener el nombre del usuario automáticamente
    const token = localStorage.getItem("token");

    if (!creator) {
        alert("No se ha encontrado el nombre del usuario. Intenta iniciar sesión nuevamente.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/stream`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ creator })
        });

        if (response.ok) {
            getStreams(); // Recargar la lista de streams
        } else {
            const errorText = await response.text();
            console.error("Error en la respuesta:", errorText);
            alert("❌ Error al crear el Stream");
        }
    } catch (error) {
        console.error("Error al crear el Stream:", error);
        alert("❌ Hubo un problema con la solicitud.");
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem("token");   // Eliminar el token
    localStorage.removeItem("userEmail"); 
    localStorage.removeItem("userName"); 

    alert("✅ Has cerrado sesión correctamente.");
    window.location.href = "index.html"; // Redirigir a la página de inicio de sesión
}

// Evento para manejar el formulario de login
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            login(email, password);
        });
    }

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Evita que la página se recargue

            const name = document.getElementById("registerName").value;
            const email = document.getElementById("registerEmail").value;
            const password = document.getElementById("registerPassword").value;

            console.log("🔹 Intentando registrar:", { name, email, password });

            await register(email, name, password);
        });
    }

    const createStreamButton = document.getElementById("createStreamButton");

    if (createStreamButton) {
        createStreamButton.addEventListener("click", createStream);
    }

    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }


    getStreams();
});
