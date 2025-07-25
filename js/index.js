import { CocktailAPI } from './api.js';
import { ocultarLoader } from './loader.js';


const api = new CocktailAPI();

document.addEventListener("DOMContentLoaded", () => {
  cargarTragosDestacados();
});


async function cargarTragosDestacados() {
  const wrapper = document.getElementById("swiper-wrapper");
  wrapper.innerHTML = "";

  const tragos = await api.obtenerTragosDestacados();

  if (tragos.length === 0) {
    wrapper.innerHTML = "<p class='text-white'>No se encontraron tragos.</p>";
    return;
  }

  tragos.forEach(trago => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    // 👇 Obtener precio usando la función compartida
    const precio = obtenerPrecio(trago.idDrink);

    slide.innerHTML = `
    <div class="card card-swiper text-dark">
      <img src="${trago.strDrinkThumb}" class="card-img-top" alt="${trago.strDrink}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${trago.strDrink}</h5>
        <p class="bg-light text-success text-center fs-5 fw-bold rounded py-1 px-2 shadow-sm">
        <span class="fs-4">$${precio}</span>
        </p>
        <a href="pages/detalle.html?id=${trago.idDrink}" class="btn btn-warning mt-auto">Ver receta</a>
      </div>
    </div>
  `;
    wrapper.appendChild(slide);
  });


  new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    spaceBetween: 30,

    // Configuración por defecto (desktop)
    direction: "horizontal",
    slidesPerView: 4,

    // Responsive
    breakpoints: {
      0: {
        direction: "vertical",
        slidesPerView: 3,
      },
      576: {
        direction: "vertical",
        slidesPerView: 3,
      },
      768: {
        direction: "horizontal",
        slidesPerView: 3,
      },
      992: {
        direction: "horizontal",
        slidesPerView: 4,
      }
    }
  });


  ocultarLoader();
}
