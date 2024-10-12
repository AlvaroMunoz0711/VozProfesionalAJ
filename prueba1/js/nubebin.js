const cargarTablaAdministradores = async () => {
    const tablaBody = document.querySelector('#tablaadmins tbody');
    const totalAdmins = document.getElementById('totalAdmins');

    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/67009d20e41b4d34e43d2a72', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': 'https://api.jsonbin.io/v3/b/67009d20e41b4d34e43d2a72' // Cambia esto por tu clave correcta
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.record) {
            throw new Error('El campo "record" no está presente en los datos.');
        }

        const administradores = data.record.filter(usuario => usuario.rol === 'admin');

        tablaBody.innerHTML = ''; 
        totalAdmins.textContent = `Total Administradores: ${administradores.length}`;

        administradores.forEach(admin => {
            const row = document.createElement('tr');
            // Cambia admin.nombre por admin.usuario
            row.innerHTML = `<td>${admin.usuario}</td><td>${admin.rol}</td>`;
            tablaBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar administradores:', error);
    }
};

const cargarUsuariosJson = async () => {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/670097eaacd3cb34a8915c38', {
            method: 'GET',
            headers: {
                'X-Master-Key': 'https://api.jsonbin.io/v3/b/670097eaacd3cb34a8915c38', 
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const usuarios = data.record; 
        console.log('Usuarios cargados:', usuarios);

        cargarUsuariosTabla(usuarios);

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
};

const cargarUsuariosTabla = (usuarios) => {
    const tablaUsuarios = document.getElementById('tablaUsuarios').getElementsByTagName('tbody')[0];
    const totalUsuarios = document.getElementById('totalUsuarios');
    
    if (!tablaUsuarios) {
        console.error('Elemento "tablaUsuarios" no encontrado');
        return;
    }

    const usuariosFiltrados = usuarios.filter(u => u.rol === 'usuario' || u.rol === 'trabajador');
    console.log('Usuarios filtrados:', usuariosFiltrados); 
    
    tablaUsuarios.innerHTML = '';

    usuariosFiltrados.forEach((usuario) => {
        const fila = document.createElement('tr');
        
        const nombreCelda = document.createElement('td');
        nombreCelda.textContent = usuario.usuario;
        fila.appendChild(nombreCelda);
        
        const rolCelda = document.createElement('td');
        rolCelda.textContent = usuario.rol;
        fila.appendChild(rolCelda);
        
        tablaUsuarios.appendChild(fila);
    });

    totalUsuarios.textContent = `Total de usuarios: ${usuariosFiltrados.length}`;
};

document.addEventListener('DOMContentLoaded', () => {
    cargarTablaAdministradores();
    cargarUsuariosJson(); 
});

