import { CocktailAPI } from "../js/api.js";
import { ocultarLoader, mostrarLoader } from "../js/loader.js";

const api = new CocktailAPI();

const contenedor = document.getElementById("contenedor-menu");
const selectCategoria = document.getElementById("filtro-categoria");
const selectAlcohol = document.getElementById("filtro-alcohol");
const selectVaso = document.getElementById("filtro-vaso");
const paginador = document.createElement("div");
paginador.id = "paginador";
paginador.className = "text-center my-4";
contenedor.after(paginador);

let tragos = [];

// 🔽 Cargar filtros al iniciar
async function cargarFiltros() {
    const categorias = await api.listarCategorias();
    const tipos = await api.listarTiposBebida();
    const vasos = await api.listarVasos();

    categorias.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.strCategory;
        opt.textContent = c.strCategory;
        selectCategoria.appendChild(opt);
    });

    tipos.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.strAlcoholic;
        opt.textContent = t.strAlcoholic;
        selectAlcohol.appendChild(opt);
    });

    vasos.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v.strGlass;
        opt.textContent = v.strGlass;
        selectVaso.appendChild(opt);
    });
}

// 🔄 Lógica de filtrado (uno por vez)
async function aplicarFiltros() {
    mostrarLoader();
    contenedor.innerHTML = "<p class='text-center'>Cargando...</p>";

    if (selectCategoria.value) {
        tragos = await api.filtrarPorCategoria(selectCategoria.value);
    } else if (selectAlcohol.value) {
        tragos = await api.filtrarPorAlcoholic(selectAlcohol.value);
    } else if (selectVaso.value) {
        tragos = await api.filtrarPorVaso(selectVaso.value);
    } else {
        tragos = await api.obtenerTragosDestacados(30);
    }

    $('#paginador').pagination({
        dataSource: tragos,
        pageSize: 9,
        callback: async function (data, pagination) {
            mostrarLoader();
            window.scrollTo({ top: 0, behavior: "smooth" });
            await new Promise(resolve => setTimeout(resolve, 300));
            renderizarTragos(data);
            ocultarLoader();
        }
    });

    ocultarLoader();
}

// 🧾 Renderizar cards
function renderizarTragos(data) {
    contenedor.innerHTML = "";
    if (!data || data.length === 0) {
        contenedor.innerHTML = "<p class='text-center'>No se encontraron cócteles.</p>";
        return;
    }

    for (let i = 0; i < data.length; i += 3) {
        const fila = document.createElement("div");
        fila.className = "row justify-content-center g-4";

        for (let j = i; j < i + 3 && j < data.length; j++) {
            const trago = data[j];
            const precio = obtenerPrecio(trago.idDrink);

            const carrito = JSON.parse(localStorage.getItem("carritoDrinksito")) || [];
            const enCarrito = carrito.find(item => item.id === trago.idDrink);
            const cantidad = enCarrito?.cantidad || 0;

            const btnTexto = cantidad > 0
                ? `<i class=\"bi bi-check-circle-fill me-1\"></i> Agregado (${cantidad})`
                : 'Agregar al carrito';

            const btnClase = cantidad > 0 ? 'btn-outline-success' : 'btn-success';

            const col = document.createElement("div");
            col.className = "col-md-4 d-flex";
            col.innerHTML = `
        <div class=\"card h-100 w-100\">
          <img src=\"${trago.strDrinkThumb}\" class=\"card-img-top\" alt=\"${trago.strDrink}\">
          <div class=\"card-body d-flex flex-column\">
            <h5 class=\"card-title\">${trago.strDrink}</h5>
            <p class=\"card-text text-muted\">${trago.strCategory || ''}</p>
            <p class=\"bg-light text-success text-center fs-5 fw-bold rounded py-1 px-2 shadow-sm\">
              <span class=\"fs-4\">$${precio}</span>
            </p>
            <a href=\"detalle.html?id=${trago.idDrink}\" class=\"btn btn-warning mb-2\">Ver receta</a>
            <button class=\"btn ${btnClase} btn-agregar-carrito mt-auto\" 
                    data-id=\"${trago.idDrink}\" 
                    data-nombre=\"${trago.strDrink}\" 
                    data-imagen=\"${trago.strDrinkThumb}\">
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

// 📦 Eventos
selectCategoria.addEventListener("change", aplicarFiltros);
selectAlcohol.addEventListener("change", aplicarFiltros);
selectVaso.addEventListener("change", aplicarFiltros);

// 🚀 Iniciar
cargarFiltros().then(aplicarFiltros);

// 🛒 Agregar al carrito desde el menú
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

        btn.innerHTML = `<i class=\"bi bi-check-circle-fill me-1\"></i> Agregado (${itemExistente ? itemExistente.cantidad : 1})`;
        btn.classList.remove("btn-success");
        btn.classList.add("btn-outline-success");

        Swal.fire({
            title: "¡Listo!",
            text: `\"${nombre}\" fue añadido al carrito 🍹`,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
        });
    }
});