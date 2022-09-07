const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const mongose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const routes = require("./router/index");
const { createAgent } = require("@forestadmin/agent");
const {
  createSequelizeDataSource,
  createMongooseDataSource,
} = require("@forestadmin/datasource-mongoose");
const mongoUrl = process.env.MONGO_URI || "";

// connect with mongo db
mongose.connect(mongoUrl).then(() => {
  console.log(`MongoDB connected...`);
});

// Create your Forest Admin agent
// This must be called BEFORE all other middlewares on the express app
createAgent({
  authSecret: process.env.FOREST_AUTH_SECRET,
  agentUrl: process.env.FOREST_AGENT_URL,
  envSecret: process.env.FOREST_ENV_SECRET,
  isProduction: process.env.NODE_ENV === "production",
})
  // Create your Mongoose datasource (using the default connection)
  .addDataSource(createMongooseDataSource(mongose.connection))
  // Replace `myExpressApp` by your Express application
  .mountOnExpress(express())
  .start();

// let allowedOrigins = [/\.forestadmin\.com$/, /localhost:\d{4}$/];
// var corsOptions = {
//   origin: "*",
//   methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
// };
// app.use(cors(corsOptions));

let allowedOrigins = [/\.forestadmin\.com$/, /localhost:\d{4}$/];
if (process.env.CORS_ORIGINS) {
  allowedOrigins = allowedOrigins.concat(process.env.CORS_ORIGINS.split(','));
}
const corsConfig = {
  origin: allowedOrigins,
  allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type'],
  maxAge: 86400, // NOTICE: 1 day
  credentials: true,
};
app.use('/forest/authentication', cors({
  ...corsConfig,
  // The null origin is sent by browsers for redirected AJAX calls
  // we need to support this in authentication routes because OIDC
  // redirects to the callback route
  origin: corsConfig.origin.concat('null')
}));
app.use(cors(corsConfig));

//  Morgan middleware used to log HTTP requests and errors, and simplifies the process
app.use(morgan("dev"));
// bodyParser is middleware responsible for parsing the incoming request bodies in a middleware before you handle it.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// to specify which origins can access this API
app.use((req, res, next) => {
  res.header("Access-Control-Allow_Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  //   specify which methods can access API
  if (req.method == "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT",
      "POST",
      "PATCH",
      "DELETE",
      "GET"
    );
    return res.status(200).json({});
  }
  next();
});
app.use(routes);

//Error handling

app.use((req, res, next) => {
  const error = new Error("NOT FOUND");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const err = res.status(error.status || 500);
  err.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
