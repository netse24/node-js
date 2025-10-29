const Product = require("../models/product");

// ------------------------------------Products---------------------------------------
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/list-product", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/detail-product", {
        product: product,
        pageTitle: `Product Detail: ${product.title}`,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// ------------------------------------ Cart ---------------------------------------
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return fetchedCart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let fetchedProduct;
      if (products.length > 0) {
        fetchedProduct = products[0];
      }
      if (fetchedProduct) {
        const oldQuantity = fetchedProduct.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return fetchedProduct;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.deleteCart = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

// ------------------------------------Orders---------------------------------------

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        orders: orders,
        path: "/orders",
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  let orderInstance;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      if (!products || products.length === 0) {
        return res.redirect("/cart"); // Prevents empty order creation
      }
      return req.user.createOrder().then((order) => {
        orderInstance = order;
        const productsWithQuantity = products.map((product) => {
          product.orderItem = { quantity: product.cartItem.quantity };
          return product;
        });
        return orderInstance.addProducts(productsWithQuantity);
      });
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
};

// ------------------------------------Checkout---------------------------------------

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
