export class CocktailAPI {
  async buscarTragoPorNombre(nombre) {
    try {
      const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(nombre)}`);
      const data = await res.json();
      if (!data.drinks) {
        console.log(`❌ No se encontraron tragos con el nombre: ${nombre}`);
        return [];
      }
      console.log(`🍸 Resultados para "${nombre}":`, data.drinks);
      return data.drinks;
    } catch (err) {
      console.error("❌ Error al buscar trago:", err);
      return [];
    }
  }

  async filtrarPorAlcoholic(tipo) {
    try {
      const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${tipo}`);
      const data = await res.json();
      console.log(`🍷 Tragos ${tipo}:`, data.drinks);
      return data.drinks;
    } catch (err) {
      console.error("❌ Error al filtrar por tipo de trago:", err);
      return [];
    }
  }

  async filtrarPorCategoria(categoria) {
    try {
      const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${categoria}`);
      const data = await res.json();
      console.log(`📋 Tragos en la categoría ${categoria}:`, data.drinks);
      return data.drinks;
    } catch (err) {
      console.error("❌ Error al filtrar por categoría:", err);
      return [];
    }
  }

  async filtrarPorVaso(vaso) {
    try {
      const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=${vaso}`);
      const data = await res.json();
      console.log(`🥃 Tragos servidos en ${vaso}:`, data.drinks);
      return data.drinks;
    } catch (err) {
      console.error("❌ Error al filtrar por vaso:", err);
      return [];
    }
  }

  async listarCategorias() {
    try {
      const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list");
      const data = await res.json();
      console.log("📋 Categorías disponibles:", data.drinks);
      return data.drinks;
    } catch (err) {
      console.error("❌ Error al listar categorías:", err);
      return [];
    }
  }

  async listarVasos() {
    try {
      const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list");
      const data = await res.json();
      console.log("🥃 Vasos disponibles:", data.drinks);
      return data.drinks;
    } catch (err) {
      console.error("❌ Error al listar vasos:", err);
      return [];
    }
  }

  async listarTiposBebida() {
    try {
      const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list");
      const data = await res.json();
      console.log("🍷 Tipos de bebida:", data.drinks);
      return data.drinks;
    } catch (err) {
      console.error("❌ Error al listar tipos de bebida:", err);
      return [];
    }
  }

  async listarIngredientes() {
    try {
      const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list");
      const data = await res.json();
      console.log("🧪 Ingredientes disponibles:", data.drinks);
      return data.drinks;
    } catch (err) {
      console.error("❌ Error al listar ingredientes:", err);
      return [];
    }
  }

  async obtenerTragosDestacados(limit = 12) {
    try {
      const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail");
      const data = await res.json();
      return Array.isArray(data.drinks) ? data.drinks.slice(0, limit) : [];
    } catch (err) {
      console.error("❌ Error al obtener tragos destacados:", err);
      return [];
    }
  }
}