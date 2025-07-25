import { ocultarLoader } from "./loader.js";


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("carrito-container");
  const datos = JSON.parse(localStorage.getItem("carritoDrinksito")) || [];

  if (datos.length === 0) {
    container.innerHTML = "<p class='text-center'>El carrito está vacío.</p>";
    ocultarLoader()
    return;
  }


  container.innerHTML = "";
  datos.forEach((item, index) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-10 col-md-6 col-lg-4 col-xl-3 mb-4 mx-auto";

    col.innerHTML = `
      <div class="carrito-item-custom p-4 rounded-4 shadow-sm position-relative h-100">
        <div class="d-flex align-items-center">
          <div class="position-relative me-3">
            <img src="${item.imagen}" class="carrito-img" alt="${item.nombre}" />
            <span class="cantidad-badge-custom bg-success text-white">${item.cantidad || 1}</span>
          </div>
          <div class="flex-grow-1">
            <h5 class="fw-bold mb-1">${item.nombre}</h5>
            <p class="text-muted small mb-0">ID: ${item.id}</p>
          </div>
          <button class="btn btn-outline-danger btn-sm eliminar-btn ms-3" data-id="${item.id}">✖</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  setTimeout(() => {
    ocultarLoader();
  }, 200);

  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar-btn")) {
      const id = e.target.dataset.id;
      const i = datos.findIndex(item => item.id == id);

      if (i !== -1) {
        if (datos[i].cantidad > 1) {
          datos[i].cantidad -= 1;
        } else {
          datos.splice(i, 1);
        }

        localStorage.setItem("carritoDrinksito", JSON.stringify(datos));
        location.reload();
      }
    }
  });


  const finalizarBtn = document.getElementById("finalizar-compra");
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      Swal.fire({
        title: 'Datos del pedido',
        html:
          `<input type="text" id="nombre" class="swal2-input" placeholder="Nombre">` +
          `<input type="text" id="apellido" class="swal2-input" placeholder="Apellido">` +
          `<input type="text" id="direccion" class="swal2-input" placeholder="Dirección">`,
        confirmButtonText: 'Enviar pedido',
        focusConfirm: false,
        preConfirm: () => {
          const nombre = document.getElementById('nombre').value.trim();
          const apellido = document.getElementById('apellido').value.trim();
          const direccion = document.getElementById('direccion').value.trim();

          if (!nombre || !apellido || !direccion) {
            Swal.showValidationMessage('Todos los campos son obligatorios');
            return false;
          }

          return { nombre, apellido, direccion };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { nombre, apellido, direccion } = result.value;

          const orden = {
            idOrden: Date.now(),
            cliente: { nombre, apellido, direccion },
            carrito: datos
          };

          const ordenes = JSON.parse(localStorage.getItem("ordenesDrinksito")) || [];
          ordenes.push(orden);
          localStorage.setItem("ordenesDrinksito", JSON.stringify(ordenes));

          Swal.fire({
            title: "¡Gracias!",
            text: "Tu pedido fue enviado al bar virtual 🍹",
            icon: "success",
            confirmButtonText: "Cerrar"
          }).then(() => {
            localStorage.removeItem("carritoDrinksito");
            location.reload();
          });
        }
      });
    });
  }
});
