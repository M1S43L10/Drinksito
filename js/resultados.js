import { CocktailAPI } from './api.js';
import { ocultarLoader } from './loader.js';


const api = new CocktailAPI();
const contenedor = document.getElementById("resultado-busqueda");
const paginador = document.createElement("div");
paginador.className = "text-center my-4";
contenedor.after(paginador);

const TRAGOS_POR_PAGINA = 9;
let tragos = [];
let paginaActual = 1;

// 🔍 Cargar resultados iniciales
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
    return;
  }

  tragos = await api.buscarTragoPorNombre(query);

  if (tragos.length === 0) {
    contenedor.innerHTML = `<p class='text-center'>No se encontraron resultados para <strong>${query}</strong>.</p>`;
    ocultarLoader(); // 🔥 aseguramos que se cierre el loader
    return;
  }


  mostrarPagina(1);
  crearPaginacion(tragos.length);
  esperarCargaDeImagenes(() => {
    ocultarLoader();
  });

});

// 🖼️ Mostrar una página específica
function mostrarPagina(numPagina) {
  contenedor.innerHTML = "";
  paginaActual = numPagina;

  const inicio = (numPagina - 1) * TRAGOS_POR_PAGINA;
  const fin = inicio + TRAGOS_POR_PAGINA;
  const paginados = tragos.slice(inicio, fin);

  for (let i = 0; i < paginados.length; i += 3) {
    const fila = document.createElement("div");
    fila.className = "row justify-content-center g-4";

    for (let j = i; j < i + 3 && j < paginados.length; j++) {
      const trago = paginados[j];
      const col = document.createElement("div");
      col.className = "col-md-4 d-flex";
      col.innerHTML = `
        <div class="card h-100 w-100">
          <img src="${trago.strDrinkThumb}" class="card-img-top" alt="${trago.strDrink}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${trago.strDrink}</h5>
            <p class="card-text text-muted">${trago.strCategory || ''}</p>
            <a href="detalle.html?id=${trago.idDrink}" class="btn btn-warning mt-auto">Ver receta</a>
          </div>
        </div>
      `;
      fila.appendChild(col);
    }


    contenedor.appendChild(fila);
  }
}

// 🔢 Crear botones de paginación
function crearPaginacion(totalItems) {
  paginador.innerHTML = "";
  const totalPaginas = Math.ceil(totalItems / TRAGOS_POR_PAGINA);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.className = `btn btn-sm mx-1 ${i === paginaActual ? 'btn-primary' : 'btn-outline-primary'}`;
    btn.textContent = i;
    btn.onclick = () => {
      mostrarPagina(i);
      crearPaginacion(tragos.length);
    };
    paginador.appendChild(btn);
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
