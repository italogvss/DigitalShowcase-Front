import ReactDOMServer from "react-dom/server";
import { PlaylistItems } from "../Model/PlaylistModel";
import { Product } from "../Model/ProductModel";
import { Template } from "../Model/TemplateModel";
import { PriceTableLayout } from "../Model/FullPlaylistModel";
import PriceTableDisplay from "../Pages/Templates/PriceTableDisplay";
import { PriceTable } from "../Model/PriceTableModel";

export function createPriceTableDisplays(items: PlaylistItems[], products: Product[]) {
  const layouts: PriceTableLayout[] = [];

  // Filtra os itens que são do tipo "priceTable"
  const tableItems = items.filter(item => item.type === "priceTable");
  console.log("tableItems", tableItems)
  if (tableItems.length === 0) {
    return layouts;
  }

  tableItems.forEach(item => {
    // Seleciona os produtos da tabela atual
    const tableProducts = products.filter(
      product => product.priceTableId === (item.data.id as number) // Confirma que sempre há um número
    );

    // Verifica se há produtos e se existe um template
    if (tableProducts.length > 0 && item.template) {
      // Calcula os displays necessários, assumindo que calcDisplay retorna um array de arrays de produtos
      const displays = calcDisplay(tableProducts, item.template.rows, item.template.columns);

      // Para cada display, gera o HTML e cria um layout
      displays.forEach((displayProducts, index) => {
        const html = renderHTML(item.template!, displayProducts, (item.data as PriceTable).name); // '!' confirma que template sempre existe
        layouts.push({
          playlistId: item.id ?? 0, // Se item.id for null ou undefined, usa 0
          priceTableId: item.data.id as number, // Confirma que sempre há um número
          html,
          part: index,
          order: item.order
        });
      });
    }
  });

  return layouts;

}


function renderHTML(template: Template, products: Product[], tableName: string) {
  const innerHtmlContent = ReactDOMServer.renderToStaticMarkup(<PriceTableDisplay template={template} products={products} tableName={tableName}/>)
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Android TV Box</title>
          <style>
              html,body{
              width: 100%;
              height: 100%;         
              margin: 0;
              padding: 0;     
              font-size: 24px;     
                }
          </style>
        </head>
        <body>
          ${innerHtmlContent}
        </body>
      </html>
  `;
  return htmlContent
}

export function calcDisplay(products: Product[], rows: number, columns: number) {
  const totalItemsPerDisplay = columns * rows;
  const displays = [];
  for (let i = 0; i < products.length; i += totalItemsPerDisplay) {
    displays.push(products.slice(i, i + totalItemsPerDisplay));
  }
  return displays
}