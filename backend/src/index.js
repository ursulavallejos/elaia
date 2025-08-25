import dotenv from "dotenv";
import { sequelize } from "./db/index.js";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await sequelize.sync();
    console.log("✅ Conexión a la base de datos exitosa");
    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar la base de datos:", error);
  }
};

startServer();