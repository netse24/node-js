const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { get404 } = require("./controllers/errors");
// const rootDir = require("./utils/path");
// const expressHandleBar = require("express-handlebars");
// const { engine } = require("express-handlebars");
const port = 3000;
const app = express();

// app.engine(
//   "hbs",
//   expressHandleBar({
//     layoutDir: "views/layouts/",
//     defaultLayout: "main-layout",
//   })
// );

// app.engine(
//   "hbs",
//   engine({
//     layoutsDir: "views/layouts/",
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// );
// app.set("view engine", "hbs");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// Middleware to handle 404 errors
app.use(get404);
app.listen(port);
