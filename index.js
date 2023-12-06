import MongoStore from "connect-mongo";
import express from "express";
import "express-async-errors";
import compression from "express-compression";
import handlebars from "express-handlebars";
import session from "express-session";
import passport from "passport";
import FileStore from "session-file-store";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import env from "./src/config/enviroment.config.js";
import { iniPassport } from "./src/config/passport.config.js";
import { errorHandler } from "./src/middlewares/main.js";
import { cartsApiRouter } from "./src/routes/carts-api.router.js";
import { cartsRouter } from "./src/routes/carts.router.js";
import { errorRouter } from "./src/routes/error.router.js";
import { home } from "./src/routes/home.router.js";
import { loggers } from "./src/routes/loggers.router.js";
import { login } from "./src/routes/login.router.js";
import { mockingProductsRouter } from "./src/routes/mocking-products.router.js";
import { sendEmailRouter } from "./src/routes/sendEmail.router.js";
import { productsAdminRouter } from "./src/routes/products-admin-router.js";
import { productsApiRouter } from "./src/routes/products-api.router.js";
import { productsRouter } from "./src/routes/products.router.js";
import { purchasesRouter } from "./src/routes/purchases.router.js";
import { recovery } from "./src/routes/recovery.router.js";
import { sessionsRouter } from "./src/routes/sessions.router.js";
import { testChatRouter } from "./src/routes/test-chat.router.js";
import { apiTickets } from "./src/routes/tickets.router.js";
import { usersApiRouter } from "./src/routes/users-api.router.js";
import { usersRouter } from "./src/routes/users.router.js";
import CustomError from "./src/services/errors/custom-error.js";
import Errors from "./src/services/errors/enums.js";
import { connectMongo, connectSocketServer, logger } from "./src/utils/main.js";

// CONFIG BASICAS Y CONEXION A DB
const app = express();
app.use(compression({ brotli: { enabled: true, zlib: {} } }));
const PORT = env.port || 8080;
const fileStore = FileStore(session);

connectMongo();

// HTTP SERVER
const httpServer = app.listen(PORT, () => {
  logger.info(`Levantando en puerto http://localhost:${PORT}`);
});

connectSocketServer(httpServer);
app.use(
  session({
    secret: "dasdasdas",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: env.mongoUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 3600,
    }),
  }),
);

// DIRNAME CONFIG
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// MIDDLEWARES BASICOS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// CONFIG DEL MOTOR DE PLANTILLAS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// CONFIG DE PASSPORT
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

// SWAGGER DOCUMENTATION
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación From Arg",
      description: "Hamburguesas ONLINE",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/api/doc", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// ENDPOINTS
app.use("/api/products", productsApiRouter);
app.use("/api/carts", cartsApiRouter);
app.use("/api/users", usersApiRouter);
app.use("/api/mockingproducts", mockingProductsRouter);
app.use("/loggerTest", loggers);
app.use("/send-email", sendEmailRouter);
app.use("/api/tickets", apiTickets);
app.use("/api/sessions", sessionsRouter);
app.get("/api/sessions/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/api/sessions/githubcallback", passport.authenticate("github", { failureRedirect: "/error" }), (req, res) => {
  req.session.user = {
    firstName: req.user.firstName,
    role: req.user.role,
  };
  res.redirect("/home");
});
// PLANTILLAS
app.use("/", login);
app.use("/home", home);
app.use("/recovery", recovery);
app.use("/products", productsRouter);
app.use("/products-admin", productsAdminRouter);
app.use("/users", usersRouter);
app.use("/cart", cartsRouter);
app.use("/purchases", purchasesRouter);
app.use("/test-chat", testChatRouter);
app.use("/error", errorRouter);

app.get("*", (req, res, next) => {
  try {
    CustomError.createError({
      name: "Page Not Found",
      cause: "Non existent path",
      message: "The path you are trying to access does not exist",
      code: Errors.ROUTING_ERROR,
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);