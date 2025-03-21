# Frontend MicroserviceX

## Descripción

Este es el frontend para la aplicación MicroserviceX, una plataforma que permite a los usuarios crear posts cortos (estilo Twitter) y organizarlos en streams (hilos). El frontend está construido con HTML, CSS y JavaScript vanilla, y se comunica con el backend a través de una API REST.

## Tecnologías Utilizadas

- **HTML5**: Para la estructura de las páginas
- **CSS3**: Para los estilos y diseño responsive
- **JavaScript**: Para la lógica de la aplicación y comunicación con la API
- **Amazon S3**: Para el alojamiento de los archivos estáticos

## Estructura del Proyecto

```
├── index.html       # Página de inicio de sesión y registro
├── home.html        # Página principal con streams y posts
├── app.js           # Lógica de la aplicación
└── styles.css       # Estilos de la aplicación
```

## Características Principales

1. **Autenticación de Usuarios**:
   - Inicio de sesión con email y contraseña
   - Registro de nuevos usuarios
   - Almacenamiento de token JWT en localStorage

2. **Gestión de Streams**:
   - Visualización de streams disponibles
   - Creación de nuevos streams

3. **Gestión de Posts**:
   - Visualización de posts dentro de un stream
   - Creación de nuevos posts en un stream seleccionado

4. **Interfaz de Usuario**:
   - Diseño limpio y minimalista
   - Navegación intuitiva
   - Responsive para adaptarse a diferentes dispositivos

## Flujo de Uso

1. **Autenticación**:
   - El usuario accede a `index.html`
   - Puede iniciar sesión con credenciales existentes o registrarse
   - Al autenticarse correctamente, es redirigido a `home.html`

2. **Página Principal**:
   - Muestra todos los streams disponibles como botones
   - Permite crear nuevos streams
   - Permite cerrar sesión

3. **Visualización de Posts**:
   - Al hacer clic en un stream, se muestran sus posts
   - Aparece la opción para crear un nuevo post en ese stream

## Integración con el Backend

El frontend se comunica con el backend a través de una API REST desplegada en AWS Lambda. La URL base de la API está configurada como una constante en `app.js`:

```javascript
const API_URL = "https://ls5zx6mo46.execute-api.us-east-1.amazonaws.com/dev";
```

Todas las peticiones a endpoints protegidos incluyen el token JWT en el encabezado `Authorization`:

```javascript
const response = await fetch(`${API_URL}/endpoint`, {
    method: "METHOD",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
});
```

## Seguridad

1. **Autenticación JWT**:
   - Los tokens se almacenan en localStorage
   - Se incluyen en todas las peticiones a endpoints protegidos
   - Al cerrar sesión, se eliminan del almacenamiento

2. **Validación de Formularios**:
   - Se validan los campos obligatorios antes de enviar las peticiones
   - Se muestran mensajes de error cuando es necesario

## Despliegue

El frontend está desplegado en Amazon S3 como un sitio web estático, lo que proporciona:

1. **Alta disponibilidad**: Gracias a la infraestructura de AWS
2. **Bajo costo**: Solo se paga por el almacenamiento y transferencia utilizados
3. **Escalabilidad**: Manejo automático de picos de tráfico

### Pasos para Desplegar en S3

1. Crear un bucket en S3 con permisos de acceso público
2. Habilitar el alojamiento de sitios web estáticos
3. Configurar la política del bucket para permitir acceso público
4. Subir los archivos HTML, CSS y JavaScript
5. Acceder al sitio web a través de la URL proporcionada por S3

## Gestión de Estado

La aplicación utiliza `localStorage` para mantener el estado entre navegaciones:

- `token`: Almacena el JWT para la autenticación
- `userEmail`: Almacena el email del usuario actual
- `userName`: Almacena el nombre del usuario para crear streams y posts

## Funciones Principales

### Autenticación

- `login(email, password)`: Autentica al usuario con el backend
- `register(email, name, password)`: Registra un nuevo usuario
- `logout()`: Cierra la sesión del usuario

### Gestión de Streams

- `getStreams()`: Obtiene y muestra todos los streams disponibles
- `createStream()`: Crea un nuevo stream

### Gestión de Posts

- `loadPosts(streamId)`: Carga y muestra los posts de un stream
- `createPost(streamId)`: Crea un nuevo post en un stream

## Consideraciones para Desarrollo Local

Para ejecutar el proyecto localmente:

1. Clonar el repositorio
2. Abrir `index.html` en un navegador o usar un servidor local como Live Server
3. Modificar la constante `API_URL` en `app.js` si es necesario conectar a un backend local:
   ```javascript
   // Descomentar para desarrollo local
   // const API_URL = "http://localhost:8081";
   ```

## Conclusión

Este frontend proporciona una interfaz simple pero efectiva para interactuar con el backend de MicroStream. Su diseño minimalista y su enfoque en la funcionalidad principal lo hacen perfecto para demostrar las capacidades del sistema backend basado en microservicios.
