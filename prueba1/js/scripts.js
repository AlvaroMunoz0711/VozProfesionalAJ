const tarjetita = (element) => {
    const tarjeta = element.closest('.card'); 
    const contenido = tarjeta.querySelector('.contenido');
    
    if (contenido.style.display === "none" || contenido.style.display === "") {
        contenido.style.display = "block"; 
        element.src = "../img/up.png"; // Cambia a la imagen de "arriba"
    } else {
        contenido.style.display = "none"; 
        element.src = "../img/down.png"; // Cambia a la imagen de "abajo"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    validarAcceso(); 
    mostrarBienvenida();

    if (window.location.pathname.includes('adminindex.html') || window.location.pathname.includes('admin.html')) {
        validarAccesoAdmin(); 
    }

    if (window.location.pathname.includes('trabajador.html') || window.location.pathname.includes('trabajadorindex.html')) {
        validarAccesotrabajador(); 
    }

    cargarUsuarios().then(() => {
        const rol = localStorage.getItem('rol');
        
        if (rol === 'admin') {
            cargarTarjetasAdmin(); 
        } else if (rol === 'usuario') {
            cargarTarjetasUsuario(); 
        }
    });

    const formularioTrabajador = document.getElementById('formularioTrabajador');
    if (formularioTrabajador) {
        formularioTrabajador.addEventListener('submit', manejarFormularioTrabajador);
    }

    const formularioLogin = document.getElementById('formularioLogin');
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', manejarLogin);
    }

    const nav = document.getElementById("HD");
    const img = document.getElementById("Bretractil");

    nav.style.display = "none";

    img.onclick = () => {
        if (nav.style.display === "none" || nav.style.display === "") {
            nav.style.display = "block"; 
            img.src = "../img/arriba.png";
        } else {
            nav.style.display = "none"; 
            img.src = "../img/abajo.png"; 
        }
    };

    const contenidos = document.querySelectorAll('.contenido');
    contenidos.forEach(contenido => {
        contenido.style.display = "none";
    });

    const tarjetas = document.querySelectorAll('.tarjeta');

    tarjetas.forEach((tarjeta) => {
        const img = tarjeta.querySelector('.retractil'); 
        img.onclick = () => tarjetita(img); 
    });
}); 

let usuarios = [];
const trabajadoresAceptados = [];

const mostrarBienvenida = () => {
    const mensajeBienvenida = document.getElementById('mensajeBienvenida');
    
    if (!mensajeBienvenida) {
        return; 
    }

    const nombreUsuario = localStorage.getItem('nombreUsuario');
    
    if (nombreUsuario) {
        mensajeBienvenida.textContent = 'Bienvenido ' + nombreUsuario;
    } else {
        mensajeBienvenida.textContent = 'Bienvenido Usuario';
    }
};

const cargarUsuarios = async () => {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/670095bfacd3cb34a8915b72', {
            method: 'GET',
            headers: {
                'X-Master-Key': 'https://api.jsonbin.io/v3/b/670095bfacd3cb34a8915b72', 
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        usuarios = data.record;
        console.log('Usuarios cargados:', usuarios);

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
};

const manejarLogin = (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;

    if (usuarios.length === 0) {
        alert('No se han cargado los usuarios. Intenta más tarde.');
        return;
    }

    const user = usuarios.find(u => u.usuario === usuario && u.contrasena === contrasena);

    if (user) {
        localStorage.setItem('rol', user.rol);
        localStorage.setItem('nombreUsuario', user.usuario);

        if (user.rol === 'admin') {
            window.location.href = '/prueba1/html/adminindex.html';
        } else if (user.rol === 'trabajador') {
            window.location.href = '/prueba1/html/trabajadorindex.html';
        } else if (user.rol === 'usuario') {
            window.location.href = '/prueba1/html/usuarioindex.html';
        }
    } else {
        alert('Usuario o contraseña incorrectos');
    }
};

const cerrarSesion = () => {
    localStorage.removeItem('rol');
    localStorage.removeItem('nombreUsuario');
    window.location.href = '/prueba1/index.html'; 
};

const validarAcceso = () => {
    const rol = localStorage.getItem('rol');

    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage !== 'index.html' && !rol) {
        window.location.href = '/prueba1/index.html'; 
    }
};

const validarAccesoAdmin = () => {
    const rol = localStorage.getItem('rol');

    if (!rol || rol !== 'admin') {
        alert('Acceso denegado. Solo los administradores pueden acceder a esta página.');
        window.location.href = '/prueba1/index.html'; 
    } else {
        console.log("Acceso autorizado para administrador.");
    }
};


const validarAccesotrabajador = () => {
    const rol = localStorage.getItem('rol');

    if (!rol || (rol !== 'admin' && rol !== 'trabajador')) {
        alert('Acceso denegado. Solo los trabajadores pueden acceder a esta página.');
        window.location.href = '/prueba1/index.html';
    } else {
        console.log("Acceso autorizado para trabajador.");
    }
};

const manejarFormularioTrabajador = (e) => {
    e.preventDefault();

    const edad = document.getElementById('edad').value;
    
    if (edad <= 0) {
        alert('La edad debe ser un número positivo.');
        return;
    }

    const trabajadorData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        correo: document.getElementById('correo').value,
        titulo: document.getElementById('titulo').value,
        ubicacion: document.getElementById('ubicacion').value,
        edad: edad,
        telefono: document.getElementById('telefono').value,
        genero: document.querySelector('input[name="genero"]:checked').value,
        nivelEducativo: document.getElementById('nivelEducativo').value
    };

    if (!trabajadorData.nombre || !trabajadorData.apellido || !trabajadorData.correo ||
        !trabajadorData.titulo || !trabajadorData.ubicacion || !trabajadorData.edad || 
        !trabajadorData.telefono || !trabajadorData.genero || !trabajadorData.nivelEducativo) {
        alert('Por favor completa todos los campos.');
        return;
    }

    let trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];
    trabajadores.push(trabajadorData);
    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));

    alert('Solicitud enviada al administrador.');
    document.getElementById('formularioTrabajador').reset();

    if (localStorage.getItem('rol') === 'admin') {
        cargarTarjetasAdmin();
    }
};

const cargarTarjetasAdmin = () => {
    const contenedorTarjetas = document.querySelector('#contenedorTarjetas');
    const trabajadoresGuardados = JSON.parse(localStorage.getItem('trabajadores')) || [];
    
    contenedorTarjetas.innerHTML = '';

    trabajadoresGuardados.forEach((trabajador, index) => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('card', 'mb-3');
        tarjeta.style.width = '18rem';

        // Seleccionar la imagen dependiendo del género
        let imagenSrc;
        if (trabajador.genero === 'M') {
            imagenSrc = '/prueba1/img/azul.jpg';
        } else if (trabajador.genero === 'F') {
            imagenSrc = '/prueba1/img/rosa.jpg';
        } else {
            imagenSrc = '/prueba1/img/otros.jpg';
        }

        // Crear la estructura de la tarjeta incluyendo la imagen
        const cuerpoTarjeta = `
            <img src="${imagenSrc}" class="card-img-top" alt="Imagen de género">
            <div class="card-body">
                <h5 class="card-title">${trabajador.nombre} ${trabajador.apellido}</h5>
                <p class="card-text">
                    <strong>Título:</strong> ${trabajador.titulo}<br>
                    <strong>Correo:</strong> ${trabajador.correo}<br>
                    <strong>Ubicación:</strong> ${trabajador.ubicacion}<br>
                    <strong>Edad:</strong> ${trabajador.edad}<br>
                    <strong>Teléfono:</strong> ${trabajador.telefono}<br>
                    <strong>Género:</strong> ${trabajador.genero}<br>
                    <strong>Nivel Educativo:</strong> ${trabajador.nivelEducativo}
                </p>
            </div>
        `;

        tarjeta.innerHTML = cuerpoTarjeta;

        const botonAceptar = document.createElement('button');
        botonAceptar.textContent = 'Aceptar';
        botonAceptar.classList.add('btn', 'btn-success', 'm-2');
        botonAceptar.onclick = async () => {
            alert(`Trabajador ${trabajador.nombre} aceptado.`);
            
            let trabajadoresAceptados = JSON.parse(localStorage.getItem('trabajadoresAceptados')) || [];
            trabajadoresAceptados.push(trabajador);
            localStorage.setItem('trabajadoresAceptados', JSON.stringify(trabajadoresAceptados));

            trabajadoresGuardados.splice(index, 1);
            localStorage.setItem('trabajadores', JSON.stringify(trabajadoresGuardados));
            cargarTarjetasAdmin();
        };

        const botonRechazar = document.createElement('button');
        botonRechazar.textContent = 'Rechazar';
        botonRechazar.classList.add('btn', 'btn-danger', 'm-2');
        botonRechazar.onclick = () => {
            alert(`Trabajador ${trabajador.nombre} rechazado.`);
            trabajadoresGuardados.splice(index, 1);
            localStorage.setItem('trabajadores', JSON.stringify(trabajadoresGuardados));
            cargarTarjetasAdmin();
        };

        const botones = document.createElement('div');
        botones.classList.add('card-body');
        botones.appendChild(botonAceptar);
        botones.appendChild(botonRechazar);

        tarjeta.appendChild(botones);
        contenedorTarjetas.appendChild(tarjeta);
    });
};

const cargarTarjetasUsuario = () => {
    const contenedorTarjetas = document.querySelector('#contenedorTarjetasAceptados');
    const trabajadoresAceptados = JSON.parse(localStorage.getItem('trabajadoresAceptados')) || [];

    contenedorTarjetas.innerHTML = '';

    trabajadoresAceptados.forEach(trabajador => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('card');
        tarjeta.style.width = '18rem';

        const imagen = document.createElement('img');
        imagen.classList.add('card-img-top');
        if (trabajador.genero === 'M') {
            imagen.src = '../img/azul.jpg';
        } else if (trabajador.genero === 'F') {
            imagen.src = '../img/rosa.jpg';
        } else {
            imagen.src = '../img/otros.jpg';
        }
        imagen.alt = `Imagen de ${trabajador.genero}`;

        const cuerpoTarjeta = document.createElement('div');
        cuerpoTarjeta.classList.add('card-body');

        const titulo = document.createElement('h5');
        titulo.classList.add('card-title');
        titulo.textContent = `${trabajador.nombre} ${trabajador.apellido}`;

        const texto = document.createElement('p');
        texto.classList.add('card-text');
        texto.innerHTML = `
            <strong>Título:</strong> ${trabajador.titulo}<br>
            <strong>Correo:</strong> ${trabajador.correo}<br>
            <strong>Ubicación:</strong> ${trabajador.ubicacion}<br>
            <strong>Edad:</strong> ${trabajador.edad}<br>
            <strong>Teléfono:</strong> ${trabajador.telefono}<br>
            <strong>Género:</strong> ${trabajador.genero}<br>
            <strong>Nivel Educativo:</strong> ${trabajador.nivelEducativo}
        `;

        cuerpoTarjeta.appendChild(titulo);
        cuerpoTarjeta.appendChild(texto);

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(cuerpoTarjeta);

        contenedorTarjetas.appendChild(tarjeta);
    });
};

cargarTarjetasUsuario();

const dropdown = document.querySelector('.dropdown');
if (dropdown) {
    dropdown.addEventListener('click', () => {
        dropdown.classList.toggle('open');
    });
}

const tarjetas = document.querySelectorAll('.tarjeta');

tarjetas.forEach((tarjeta) => {
    const img = tarjeta.querySelector('.retractil'); 
    const contenido = tarjeta.querySelector('.contenido');

    img.onclick = () => {
        if (contenido.style.display === "none" || contenido.style.display === "") {
            contenido.style.display = "block"; 
            img.src = "../img/up.png"; 
        } else {
            contenido.style.display = "none"; 
            img.src = "../img/down.png"; 
        }
    };
});


document.addEventListener("DOMContentLoaded", () => {
    const contenidos = document.querySelectorAll('.contenido');
    contenidos.forEach(contenido => {
        contenido.style.display = "none"; 
    });
});


