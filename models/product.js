const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (callback) => {
  fs.readFile(p, (err, fileContent) => {
    if (err || fileContent.length === 0) {
      return callback([]);
    }
    try {
      const products = JSON.parse(fileContent);
      return callback(products);
    } catch (e) {
      console.error("Error parsing products.json:", e);
      return callback([]);
    }
  });
};
class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      const updatedProducts = [...products];
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        if (existingProductIndex >= 0) {
          updatedProducts[existingProductIndex] = this;
        }
      } else {
        this.id = uuidv4();
        // this.id = Math.random().toString();
        updatedProducts.push(this);
      }
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
  static findById(id, callback) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      callback(product);
    });
  }
  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      if (!product) {
        return;
      }
      const updatedProducts = products.filter((p) => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        Cart.deleteProduct(id, product.price);
      });
    });
  }
}
module.exports = Product;
// export default Product;
