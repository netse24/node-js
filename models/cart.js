const fs = require("fs");
const path = require("path");
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

const getCart = (fileContent) => {
  if (
    !fileContent ||
    fileContent.length === 0 ||
    fileContent.toString().trim() === ""
  ) {
    return { products: [], totalPrice: 0 };
  }
  try {
    return JSON.parse(fileContent);
  } catch (e) {
    console.error("Error parsing cart.json:", e);
    // Return an empty cart on corruption
    return { products: [], totalPrice: 0 };
  }
};

class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        console.log("Cart Read Error:", err);
        return;
      }
      let cart = getCart(fileContent);
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        // cart.products = [...cart.products, updatedProduct];
        cart.products.push(updatedProduct);
      }
      cart.totalPrice += +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log("Cart Write Error:", err);
      });
    });
  }
  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      let cart = getCart(fileContent);
      const product = cart.products.find((prod) => prod.id === id);

      if (!product) {
        return;
      }

      const productQty = product.qty;
      cart.products = cart.products.filter((prod) => prod.id !== id);
      cart.totalPrice -= +productPrice * productQty;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log("Cart Delete Write Error:", err);
      });
    });
  }
  static getCartProduct(callback) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return callback({ products: [], totalPrice: 0 });
      }
      const cart = getCart(fileContent);
      callback(cart);
    });
  }
}

module.exports = Cart;
