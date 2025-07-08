import { Product } from "../Model/ProductModel";

 
  export const parseProductFile = async (file: File, idUser: number): Promise<Product[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        const content = reader.result as string;
        const lines = content.split('\n').filter(line => line.trim() !== '');
  
        const products: Product[] = lines.map(line => {
            // Extrair ID (do 4º ao 9º caractere)
            const idProduct = parseInt(line.substring(3, 9).trim());
          
            // Extrair preço (do 10º ao 15º caractere)
            const priceCents = line.substring(9, 15).trim();
            const price = parseInt(priceCents) / 100; // Converter para número e formatar como preço com dois decimais
          
            // Extrair nome do produto
            const nameEnd = line.indexOf('   ', 18); // Encontra o primeiro caractere '|' após o 15º caractere
            var name = nameEnd === -1 ? line.substring(18).trim() : line.substring(18, nameEnd).trim();
            name.toLocaleUpperCase()
            // Adicionar um valor padrão para 'table' se não for utilizado
            const priceTableId = null;
                               
            return { id:null, idProduct, idUser, name, price, priceTableId };
          });
        resolve(products);
      };
  
      reader.onerror = () => {
        reject(new Error(`Falha ao ler o arquivo: ${file.name}`));
      };  
      reader.readAsText(file, "utf-8");
    });
  };

  