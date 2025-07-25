import { ocultarLoader } from './loader.js';

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    Swal.fire("Error", "No se especificó ningún trago", "error");
    return;
  }

  const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();
  const trago = data.drinks?.[0];

  if (!trago) {
    Swal.fire("Oops", "No se encontró el trago", "warning");
    return;
  }

  const ingredientes = [];
  for (let i = 1; i <= 15; i++) {
    const nombre = trago[`strIngredient${i}`];
    const medida = trago[`strMeasure${i}`];
    if (nombre) ingredientes.push(`${medida || ''} ${nombre}`.trim());
  }

  const contenedor = document.getElementById("detalle-trago");

  // 🔍 Obtener cantidad actual desde localStorage
  const carrito = JSON.parse(localStorage.getItem("carritoDrinksito")) || [];
  const itemExistente = carrito.find(item => item.id === trago.idDrink);
  let cantidad = itemExistente?.cantidad || 0;

  const btnTexto = cantidad > 0
    ? `<i class="bi bi-check-circle-fill me-1"></i> Agregado (${cantidad})`
    : '<i class="bi bi-cart-plus-fill"></i> Agregar al carrito';

  const btnClase = cantidad > 0 ? 'btn-outline-success' : 'btn-success';
  const precio = obtenerPrecio(trago.idDrink);  // 👈 nuevo

  contenedor.innerHTML = `
    <div class="p-4 mb-4 bg-white rounded shadow-sm">
      <div class="row g-4 align-items-center">
        <div class="col-md-5">
          <img src="${trago.strDrinkThumb}" class="img-fluid rounded w-100" alt="${trago.strDrink}">
        </div>
        <div class="col-md-7">
          <h2 class="mb-1">${trago.strDrink}</h2>
          <p class="text-success fw-bold display-5 mb-4">$${precio}</p>

          <p><strong>Categoría:</strong> ${trago.strCategory}</p>
          <p><strong>Tipo:</strong> ${trago.strAlcoholic}</p>
          <p><strong>Vaso:</strong> ${trago.strGlass}</p>

          <h5>Ingredientes:</h5>
          <ul class="mb-3">
            ${ingredientes.map(ing => `<li>${ing}</li>`).join('')}
          </ul>

          <h5>Instrucciones:</h5>
          <p>${trago.strInstructions}</p>

          <button id="btn-agregar" class="btn ${btnClase} mt-4">
            ${btnTexto}
          </button>
        </div>
      </div>
    </div>
  `;


  // Evento para agregar al carrito con cantidad
  const botonAgregar = document.getElementById("btn-agregar");
  botonAgregar.addEventListener("click", () => {
    const carrito = JSON.parse(localStorage.getItem("carritoDrinksito")) || [];
    const existente = carrito.find(item => item.id === trago.idDrink);

    if (existente) {
      existente.cantidad = (existente.cantidad || 1) + 1;
      cantidad = existente.cantidad;
    } else {
      carrito.push({
        id: trago.idDrink,
        nombre: trago.strDrink,
        imagen: trago.strDrinkThumb,
        cantidad: 1,
        precio: precio
      });

      cantidad = 1;
    }

    localStorage.setItem("carritoDrinksito", JSON.stringify(carrito));

    // Actualizar botón
    botonAgregar.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> Agregado (${cantidad})`;
    botonAgregar.classList.remove("btn-success");
    botonAgregar.classList.add("btn-outline-success");

    Swal.fire("¡Listo!", `${trago.strDrink} fue añadido al carrito 🍹`, "success");
  });

  ocultarLoader();
});