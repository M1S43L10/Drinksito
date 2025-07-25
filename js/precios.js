function obtenerPrecio(id) {
    const precios = JSON.parse(localStorage.getItem("preciosDrinksito")) || {};

    if (precios[id]) return precios[id];

    // Base aleatoria entre 1500 y 2900 (redondeada a centenas)
    const base = Math.floor(Math.random() * ((2900 - 1500) / 100 + 1)) * 100 + 1500;

    // Terminaciones comerciales comunes
    const terminaciones = [0, 50, 90, 95, 99];

    // Elegimos una terminación al azar
    const terminacion = terminaciones[Math.floor(Math.random() * terminaciones.length)];

    // Calculamos el precio final
    const precio = base + terminacion;

    precios[id] = precio;
    localStorage.setItem("preciosDrinksito", JSON.stringify(precios));

    return precio;
}
