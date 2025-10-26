const Product = require("../models/product");
const Cart = require("../models/cart");

const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/list-product", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};
const getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (product) {
      res.render("shop/detail-product", {
        product: product,
        pageTitle: `Product Detail: ${product.title}`,
        path: "/products",
      });
    } else {
      res.status(404).render("404", { pageTitle: "Product Not Found" });
    }
  });
};
const getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

const getCart = (req, res, next) => {
  Cart.getCartProduct((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (prod of products) {
        const cartProductData = cart.products.find((p) => p.id === prod.id);
        if (cartProductData) {
          cartProducts.push({ productData: prod, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

const postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    // Here you would typically add the product to the user's cart in the database
    Cart.addProduct(prodId, product.price);
    res.redirect("/cart");
  });
};
const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
module.exports = {
  getIndex: getIndex,
  getCart: getCart,
  postCart: postCart,
  getOrders: getOrders,
  getCheckout: getCheckout,
  getProducts: getProducts,
  getProduct: getProduct,
};
