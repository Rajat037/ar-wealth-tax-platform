import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";
import chatRoutes from "./routes/chat.js";
import { initializeDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import statusMonitor from "express-status-monitor";
import xss from "xss-clean";
import admin from "firebase-admin";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});

// Initialize Firebase Admin
if (
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY &&
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY !==
    "your-firebase-service-account-json-here"
) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error.message);
    console.warn(
      "Google auth will not work. Please provide a valid Firebase service account key.",
    );
  }
} else {
  console.warn(
    "Firebase service account key not provided. Google auth will not work.",
  );
}

// Middleware
app.use(statusMonitor({ path: "/status" }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://checkout.razorpay.com",
        ],
        "connect-src": [
          "'self'",
          "https://api.razorpay.com",
          "https://checkout.razorpay.com",
        ],
        "frame-src": [
          "'self'",
          "https://api.razorpay.com",
          "https://checkout.razorpay.com",
          "https://maps.google.com",
          "https://www.google.com",
        ],
        "img-src": [
          "'self'",
          "data:",
          "https://*.google.com",
          "https://*.googleusercontent.com",
          "https://*.gstatic.com",
        ],
      },
    },
  }),
);
app.use(compression());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(xss());
app.use(morgan("tiny"));
app.use(limiter);
app.use(
  csurf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
  }),
);
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https" &&
    !req.secure
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

app.use((req, res, next) => {
  if (typeof req.csrfToken === "function") {
    res.cookie("XSRF-TOKEN", req.csrfToken(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
  next();
});

app.use((req, res, next) => {
  console.log(`REQ ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/chat", chatRoutes);
app.use("/api", apiRoutes);

if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../dist");
  app.use(express.static(staticPath, { maxAge: "1y", etag: false }));

  app.get("*", (req, res, next) => {
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/status") ||
      req.path === "/health"
    ) {
      return next();
    }
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    console.error("CSRF validation failed:", err);
    return res.status(403).json({ error: "Invalid or missing CSRF token." });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is running" });
});

const startServer = async () => {
  try {
    await initializeDb();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize database and start server:", error);
    process.exit(1);
  }
};

startServer();
