const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

const postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  console.log(req.body);
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

const getEditProduct = (req, res, next) => {
  const { edit } = req.query;
  if (!edit) {
    return res.redirect("/");
  }
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: edit,
      product: product,
    });
  });
};

const postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};
const getDeleteProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.deleteById(productId);
  res.redirect("/admin/products");
};

const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
module.exports = {
  getProducts: getProducts,
  getAddProduct: getAddProduct,
  getEditProduct: getEditProduct,
  postAddProduct: postAddProduct,
  getDeleteProduct: getDeleteProduct,
  postEditProduct: postEditProduct,
};
