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

  // renderizar tarjetas
  tragos.forEach(trago => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="card text-dark" style="width: 16rem;">
        <img src="${trago.strDrinkThumb}" class="card-img-top p-2" alt="${trago.strDrink}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${trago.strDrink}</h5>
          <a href="/pages/detalle.html?id=${trago.idDrink}" class="btn btn-warning mt-auto">Ver receta</a>
        </div>
      </div>
    `;
    wrapper.appendChild(slide);
  });

  // iniciar Swiper
  new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 }
    }
  });

  ocultarLoader();
}
