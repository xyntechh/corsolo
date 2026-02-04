const express = require("express");
const connectDb = require("./config/db.js");
require("dotenv").config();
const userRoutes = require("./routes/user.route.js");
const cors = require("cors");
const http = require("http");
const initSocket = require("./socket.js");
const prerender = require("prerender-node");
const razorpayRoutes = require("./routes/razorpayRoutes.js");
const bodyParser = require("body-parser");
const clinet = require("./routes/partner.Routes.js")
const refferal = require("./routes/refferal.Routes.js")


//ADMIN DASHBOARD IMPORTING 

const dashboard = require("./routes/AdminRoutes/dashboard.Routes.js")
const adminAuth = require("./routes/AdminRoutes/adminAuth.routes.js")
const userDashboard = require("./routes/AdminRoutes/user.routes.js")
const partnerDashbord = require("./routes/AdminRoutes/partner.routes.js")
const paymentDashboard = require("./routes/AdminRoutes/payment.routes.js")
const EbookRoutes = require("./routes/AdminRoutes/eBook.routes.js")

const app = express();




app.post("/api/payment",
  bodyParser.raw({ type: "application/json" })
);

/// JSON parser for others
app.use(express.json());

// Put middleware above routes
app.use(prerender);
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE",
  credentials: true
}));

// Fetching IP middleware
app.use((req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress;

  req.clientIP = ip;
  next();
});

connectDb();

const server = http.createServer(app);
initSocket(server);

app.use("/api/user", userRoutes);
app.use("/api/payment", razorpayRoutes);
app.use("/api/partner", clinet)
app.use("/api/refferal", refferal)


//ADMIN DASHBOARD

app.use("/api/admin", adminAuth)
app.use("/api/dashboard", dashboard)
app.use("/api/userDashboard", userDashboard)
app.use("/api/partnerDashboard", partnerDashbord)
app.use("/api/paymentDashboard", paymentDashboard)
app.use("/api/eBookDashboard", EbookRoutes)


server.listen(5000, () => {
  console.log("Server running on port 5000");
});