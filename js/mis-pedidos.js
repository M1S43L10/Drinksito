import { ocultarLoader, mostrarLoader } from "./loader.js";

document.addEventListener("DOMContentLoaded", () => {
    const yaLogueado = localStorage.getItem("adminLogueado") === "true";

    const btnLogin = document.getElementById("btn-login");
    const usuarioInput = document.getElementById("usuario");
    const claveInput = document.getElementById("clave");
    const loginSection = document.getElementById("login-section");
    const pedidosSection = document.getElementById("pedidos-section");
    const listaPedidos = document.getElementById("lista-pedidos");

    const filtroEstado = document.getElementById("filtro-estado");

    if (yaLogueado) {
        mostrarLoader();
        loginSection.classList.add("d-none");
        pedidosSection.classList.remove("d-none");

        mostrarPedidos();
        activarLogout();
        return;
    }

    ocultarLoader();

    btnLogin.addEventListener("click", () => {
        const usuario = usuarioInput.value.trim();
        const clave = claveInput.value.trim();

        if (usuario === "admin" && clave === "admin") {
            localStorage.setItem("adminLogueado", "true");

            mostrarLoader();
            loginSection.classList.add("d-none");
            pedidosSection.classList.remove("d-none");

            mostrarPedidos();
            activarLogout();
        } else {
            Swal.fire("Error", "Credenciales incorrectas", "error");
        }
    });

    if (filtroEstado) {
        filtroEstado.addEventListener("change", () => {
            mostrarPedidos();
        });
    }

    function mostrarPedidos() {
        const ordenes = JSON.parse(localStorage.getItem("ordenesDrinksito")) || [];
        let historial = JSON.parse(localStorage.getItem("estadoPedidosDrinksito")) || [];

        // Asegurar que todos tengan estado
        ordenes.forEach(orden => {
            const existe = historial.some(p => p.idOrden === orden.idOrden);
            if (!existe) {
                historial.push({ idOrden: orden.idOrden, estado: "esperando" });
            }
        });

        localStorage.setItem("estadoPedidosDrinksito", JSON.stringify(historial));

        // Crear contenedor del filtro si no existe
        let contenedorFiltro = document.getElementById("filtro-contenedor");
        if (!contenedorFiltro) {
            contenedorFiltro = document.createElement("div");
            contenedorFiltro.id = "filtro-contenedor";
            contenedorFiltro.className = "mb-4 text-center";
            pedidosSection.prepend(contenedorFiltro);
        }

        // Crear filtro solo si no existe
        if (!document.getElementById("filtro-estado")) {
            contenedorFiltro.innerHTML = `
            <label class="form-label fw-bold me-2">Ver pedidos:</label>
            <select id="filtro-estado" class="form-select d-inline w-auto">
                <option value="esperando">Esperando</option>
                <option value="pagado">Pagados</option>
                <option value="anulado">Anulados</option>
                <option value="todos">Todos</option>
            </select>
        `;
            document.getElementById("filtro-estado").addEventListener("change", () => {
                mostrarPedidos();
            });
        }

        // Crear paginador si no existe
        let paginador = document.getElementById("paginador");
        if (!paginador) {
            paginador = document.createElement("div");
            paginador.id = "paginador";
            paginador.className = "text-center my-4";
            pedidosSection.appendChild(paginador);
        }

        // Filtrar órdenes según estado
        const filtroEstado = document.getElementById("filtro-estado");
        const estadoFiltro = filtroEstado?.value || "esperando";
        const filtrados = ordenes.filter(orden => {
            const estado = historial.find(p => p.idOrden === orden.idOrden)?.estado || "esperando";
            return estadoFiltro === "todos" || estado === estadoFiltro;
        });

        listaPedidos.innerHTML = "";

        if (!Array.isArray(filtrados) || filtrados.length === 0) {
            listaPedidos.innerHTML = "<p class='text-center'>No hay pedidos guardados.</p>";
            if (window.$('#paginador').data('pagination')) {
                window.$('#paginador').pagination('destroy');
            }
            ocultarLoader();
            return;
        }

        // Destruir paginador si ya está activo
        if (window.$('#paginador').data('pagination')) {
            window.$('#paginador').pagination('destroy');
        }

        // Iniciar paginación
        window.$('#paginador').pagination({
            dataSource: filtrados,
            pageSize: 6,
            callback: function (data) {
                listaPedidos.innerHTML = "";

                data.forEach(orden => {
                    let total = 0;
                    const listaItems = orden.carrito.map(item => {
                        const subtotal = (item.precio || 0) * (item.cantidad || 1);
                        total += subtotal;
                        return `<li>${item.nombre} x${item.cantidad} - $${subtotal}</li>`;
                    }).join("");

                    if (orden.envio) total += 500;

                    const estadoActual = historial.find(p => p.idOrden === orden.idOrden)?.estado || "esperando";

                    const botones = estadoActual === "esperando" ? `
                    <div class="d-flex justify-content-between mt-2">
                        <button class="btn btn-outline-success btn-sm btn-estado" data-id="${orden.idOrden}" data-estado="pagado">✔ Pagado y retirado</button>
                        <button class="btn btn-outline-danger btn-sm btn-estado" data-id="${orden.idOrden}" data-estado="anulado">✖ Anulado</button>
                    </div>
                ` : `
                    <div class="mt-2"><span class="badge bg-secondary">Estado: ${estadoActual}</span></div>
                `;

                    const div = document.createElement("div");
                    div.className = "col-12 col-md-6 col-lg-4";
                    div.innerHTML = `
                    <div class="p-3 bg-white rounded shadow-sm">
                        <h5 class="mb-1">Pedido #${orden.idOrden}</h5>
                        <p class="mb-1"><strong>Cliente:</strong> ${orden.cliente.nombre} ${orden.cliente.apellido}</p>
                        <p class="mb-2"><strong>Dirección:</strong> ${orden.cliente.direccion}</p>
                        <ul class="mb-2">${listaItems}</ul>
                        <p><strong>Envío:</strong> ${orden.envio ? "Sí (+$500)" : "No"}</p>
                        <p class="fw-bold text-success">Total: $${total}</p>
                        ${botones}
                    </div>
                `;
                    listaPedidos.appendChild(div);
                });

                ocultarLoader();
            }
        });

        // Listener para botones de estado (solo una vez)
        if (!listaPedidos.dataset.listenerAttached) {
            listaPedidos.addEventListener("click", (e) => {
                const boton = e.target.closest(".btn-estado");
                if (boton) {
                    const id = Number(boton.dataset.id);
                    const estado = boton.dataset.estado;

                    const historial = JSON.parse(localStorage.getItem("estadoPedidosDrinksito")) || [];
                    const index = historial.findIndex(p => p.idOrden === id);

                    if (index !== -1) {
                        historial[index].estado = estado;
                    } else {
                        historial.push({ idOrden: id, estado });
                    }

                    localStorage.setItem("estadoPedidosDrinksito", JSON.stringify(historial));

                    Swal.fire("Actualizado", `Pedido #${id} marcado como ${estado}`, "success").then(() => {
                        mostrarPedidos();
                    });
                }
            });
            listaPedidos.dataset.listenerAttached = "true";
        }
    }



    function activarLogout() {
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
