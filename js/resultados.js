import { CocktailAPI } from './api.js';
import { ocultarLoader, mostrarLoader } from './loader.js';


const api = new CocktailAPI();
const contenedor = document.getElementById("resultado-busqueda");
const paginador = document.getElementById("paginador");


let tragos = [];

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q")?.trim().toLowerCase();
  document.title = `Resultados para "${query}" | Drinksito`;

  const inputBusqueda = document.querySelector('input[name="q"]');
  if (inputBusqueda) {
    inputBusqueda.value = query;
  }


  if (!query) {
    contenedor.innerHTML = "<p class='text-center'>No se ingresó ningún término de búsqueda.</p>";
    ocultarLoader(); 
    return;
  }


  tragos = await api.buscarTragoPorNombre(query);

  if (tragos.length === 0) {
    contenedor.innerHTML = `<p class='text-center'>No se encontraron resultados para <strong>${query}</strong>.</p>`;
    ocultarLoader();
    return;
  }


  $('#paginador').pagination({
    dataSource: tragos,
    pageSize: 9,
    callback: function (data) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      mostrarLoader();
      renderizarTragos(data);
      esperarCargaDeImagenes(() => {
        ocultarLoader();
      });
    }
  });
});

function renderizarTragos(data) {
  contenedor.innerHTML = "";

  for (let i = 0; i < data.length; i += 3) {
    const fila = document.createElement("div");
    fila.className = `row justify-content-center g-4 ${i === 0 ? 'mt-4' : ''}`;


    for (let j = i; j < i + 3 && j < data.length; j++) {
      const trago = data[j];

      const carrito = JSON.parse(localStorage.getItem("carritoDrinksito")) || [];
      const enCarrito = carrito.find(item => item.id === trago.idDrink);
      const cantidad = enCarrito?.cantidad || 0;

      const btnTexto = cantidad > 0
        ? `<i class="bi bi-check-circle-fill me-1"></i> Agregado (${cantidad})`
        : 'Agregar al carrito';

      const btnClase = cantidad > 0 ? 'btn-outline-success' : 'btn-success';
      const col = document.createElement("div");
      const precio = obtenerPrecio(trago.idDrink);
      col.className = "col-md-4 d-flex mb-4";
      col.innerHTML = `
        <div class="card h-100 w-100">
          <img src="${trago.strDrinkThumb}" class="card-img-top" alt="${trago.strDrink}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${trago.strDrink}</h5>
            <p class="card-text text-muted">${trago.strCategory || ''}</p>
            <p class="bg-light text-success text-center fs-5 fw-bold rounded py-1 px-2 shadow-sm">
              <span class="fs-4">$${precio}</span>
            </p>    
            <a href="detalle.html?id=${trago.idDrink}" class="btn btn-warning mb-2">Ver receta</a>
            <button class="btn ${btnClase} btn-agregar-carrito mt-auto" 
                    data-id="${trago.idDrink}" 
                    data-nombre="${trago.strDrink}" 
                    data-imagen="${trago.strDrinkThumb}">
              ${btnTexto}
            </button>
          </div>
        </div>
      `;
      fila.appendChild(col);
    }

    contenedor.appendChild(fila);
  }
}



function esperarCargaDeImagenes(callback) {
  const imagenes = document.querySelectorAll('img');
  let cargadas = 0;

  if (imagenes.length === 0) return callback();

  imagenes.forEach(img => {
    if (img.complete) {
      cargadas++;
      if (cargadas === imagenes.length) callback();
    } else {
      img.addEventListener('load', () => {
        cargadas++;
        if (cargadas === imagenes.length) callback();
      });
      img.addEventListener('error', () => {
        cargadas++;
        if (cargadas === imagenes.length) callback();
      });
    }
  });
}


document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-agregar-carrito")) {
    const btn = e.target;
    const id = btn.dataset.id;
    const nombre = btn.dataset.nombre;
    const imagen = btn.dataset.imagen;

    const carrito = JSON.parse(localStorage.getItem("carritoDrinksito")) || [];

    
    const itemExistente = carrito.find(item => item.id === id);
    if (itemExistente) {
      itemExistente.cantidad = (itemExistente.cantidad || 1) + 1;
    } else {
      const precio = obtenerPrecio(id);
      carrito.push({ id, nombre, imagen, cantidad: 1, precio });
    }

    localStorage.setItem("carritoDrinksito", JSON.stringify(carrito));

    btn.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> Agregado (${itemExistente ? itemExistente.cantidad : 1})`;
    btn.classList.remove("btn-success");
    btn.classList.add("btn-outline-success");

    Swal.fire({
      title: "¡Listo!",
      text: `"${nombre}" fue añadido al carrito 🍹`,
      icon: "success",
      timer: 1200,
      showConfirmButton: false
    });
  }
});
