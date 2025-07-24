document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("carrito-container");
  const datos = JSON.parse(localStorage.getItem("carritoDrinksito")) || [];

  if (datos.length === 0) {
    container.innerHTML = "<p class='text-center'>El carrito está vacío.</p>";
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

  // ✅ Este bloque va aquí dentro
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar-btn")) {
      const id = e.target.dataset.id;
      const i = datos.findIndex(item => item.id == id);

      if (i !== -1) {
        if (datos[i].cantidad > 1) {
          datos[i].cantidad -= 1; // Resta 1 si hay más de una unidad
        } else {
          datos.splice(i, 1); // Elimina del array si queda solo 1
        }

        localStorage.setItem("carritoDrinksito", JSON.stringify(datos));
        location.reload();
      }
    }
  });


  // finalizar compra
  const finalizarBtn = document.getElementById("finalizar-compra");
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      Swal.fire({
        title: "¡Gracias!",
        text: "Tu pedido fue enviado al bar virtual 🍹",
        icon: "success",
        confirmButtonText: "Cerrar"
      }).then(() => {
        localStorage.removeItem("carritoDrinksito");
        location.reload();
      });
    });
  }
});
