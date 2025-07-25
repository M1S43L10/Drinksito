import { ocultarLoader, mostrarLoader } from "./loader.js";

document.addEventListener("DOMContentLoaded", () => {
    const yaLogueado = localStorage.getItem("adminLogueado") === "true";

    const btnLogin = document.getElementById("btn-login");
    const usuarioInput = document.getElementById("usuario");
    const claveInput = document.getElementById("clave");
    const loginSection = document.getElementById("login-section");
    const pedidosSection = document.getElementById("pedidos-section");
    const listaPedidos = document.getElementById("lista-pedidos");

    if (yaLogueado) {
        // ✅ MOSTRAR LOADER
        mostrarLoader();

        // Mostrar sección pedidos
        loginSection.classList.add("d-none");
        pedidosSection.classList.remove("d-none");

        mostrarPedidos(); // ← esto ya oculta el loader al final

        // Botón cerrar sesión
        const botonPedidos = document.getElementById("btn-pedidos");
        if (botonPedidos) {
            botonPedidos.innerHTML = '<i class="bi bi-box-arrow-left"></i> Cerrar sesión';
            botonPedidos.href = "#";
            botonPedidos.classList.remove("btn-outline-info");
            botonPedidos.classList.add("btn-outline-danger");
            botonPedidos.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("adminLogueado");
                Swal.fire("Sesión cerrada", "", "info").then(() => {
                    window.location.href = "../index.html";
                });
            });
        }

        return;
    }

    ocultarLoader();

    btnLogin.addEventListener("click", () => {
        const usuario = usuarioInput.value.trim();
        const clave = claveInput.value.trim();

        if (usuario === "admin" && clave === "admin") {
            // Guardar estado de sesión
            localStorage.setItem("adminLogueado", "true");

            // Mostrar loader inmediatamente
            mostrarLoader();

            // Ocultar login y mostrar sección pedidos
            loginSection.classList.add("d-none");
            pedidosSection.classList.remove("d-none");

            // Cargar pedidos (al finalizar oculta loader)
            mostrarPedidos();
        }
        else {
            Swal.fire("Error", "Credenciales incorrectas", "error");
        }
    });

    function mostrarPedidos() {
        const ordenes = JSON.parse(localStorage.getItem("ordenesDrinksito")) || [];

        if (ordenes.length === 0) {
            listaPedidos.innerHTML = "<p class='text-center'>No hay pedidos guardados.</p>";
            ocultarLoaderYActivarLogout();
            return;
        }

        listaPedidos.innerHTML = "";

        ordenes.forEach((orden) => {
            const div = document.createElement("div");
            div.className = "col-12 col-md-6 col-lg-4";
            div.innerHTML = `
        <div class="p-3 bg-white rounded shadow-sm">
            <h5 class="mb-1">Pedido #${orden.idOrden}</h5>
            <p class="mb-1"><strong>Cliente:</strong> ${orden.cliente.nombre} ${orden.cliente.apellido}</p>
            <p class="mb-2"><strong>Dirección:</strong> ${orden.cliente.direccion}</p>
            <ul class="mb-0">
            ${orden.carrito.map(item => `<li>${item.nombre} x${item.cantidad}</li>`).join("")}
            </ul>
        </div>
        `;
            listaPedidos.appendChild(div);
        });

        // Esperar al menos un tick para asegurar que se renderizó
        setTimeout(() => {
            ocultarLoaderYActivarLogout();
        }, 200);
    }

    function ocultarLoaderYActivarLogout() {
        ocultarLoader();

        const botonPedidos = document.getElementById("btn-pedidos");
        if (botonPedidos) {
            botonPedidos.innerHTML = '<i class="bi bi-box-arrow-left"></i> Cerrar sesión';
            botonPedidos.href = "#";
            botonPedidos.classList.remove("btn-outline-info");
            botonPedidos.classList.add("btn-outline-danger");
            botonPedidos.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("adminLogueado");
                Swal.fire("Sesión cerrada", "", "info").then(() => {
                    window.location.href = "../index.html";
                });
            });
        }
    }


});
