import axios from "axios";
import { load } from "cheerio";

// https://github.com/Wellers0n/pill/blob/main/packages/backend/package.json

// const page = `https://www.drogasil.com.br/novalgina-gotas-500mg-solucao-oral-10ml-frasco-vidro.html`;
const page = 'https://www.drogasil.com.br/max-titanium-100-whey-baunilha-900g.html?origin=search';
const getProductService = async (url) => {
  let pageHTML;

  try {
    pageHTML = await axios.get(url);
  } catch (error) {
    console.error(error);
  }

  const $ = load(pageHTML.data);
  const product = JSON.parse($('[type="application/ld+json"]').text());
  // console.log(product);

  const EAN = product.gtin13;
  const Nome = product.name;
  const Marca = product.brand.name;
  const Imagem = product.image;
  const Preço = product.offers.price;
  const Sku = product.sku;

  return { Nome, EAN, Marca, Imagem, Preço, Sku, Link: page };
};

getProductService(page).then((r) => console.log(r));
