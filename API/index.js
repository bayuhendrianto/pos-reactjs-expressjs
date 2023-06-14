const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./src/routes");
const bodyParser = require("body-parser");
const cronjob = require("./src/services/cronjob.services");
const path = require('path');

dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, 'assets')));
app.use('/assets', express.static('assets'));

app.use(cors({ credentials: true, origin: '*' }));

app.use(express.json({ extended: true, limit: '50mb', type: 'application/json' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(bodyParser.json({ extended: true, limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(cookieParser());
app.use("/", router);

// Running Task
cronjob();

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running at port " + port);
});
