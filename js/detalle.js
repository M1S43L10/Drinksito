import { CocktailAPI } from './api.js';
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

    const contenedor = document.getElementById("detalle-trago");

    // Extraer ingredientes
    const ingredientes = [];
    for (let i = 1; i <= 15; i++) {
        const nombre = trago[`strIngredient${i}`];
        const medida = trago[`strMeasure${i}`];
        if (nombre) ingredientes.push(`${medida || ''} ${nombre}`.trim());
    }

    contenedor.innerHTML = `
    <div class="row mb-5">
      <div class="col-md-5">
        <img src="${trago.strDrinkThumb}" class="img-fluid rounded shadow" alt="${trago.strDrink}">
      </div>
      <div class="col-md-7">
        <h2>${trago.strDrink}</h2>
        <p><strong>Categoría:</strong> ${trago.strCategory}</p>
        <p><strong>Tipo:</strong> ${trago.strAlcoholic}</p>
        <p><strong>Vaso:</strong> ${trago.strGlass}</p>
        <h5>Ingredientes:</h5>
        <ul>
          ${ingredientes.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        <h5>Instrucciones:</h5>
        <p>${trago.strInstructions}</p>
      </div>
    </div>
  `;
    ocultarLoader();
});
