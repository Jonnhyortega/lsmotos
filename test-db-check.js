
const mongoose = require('mongoose');

// Necesitas definir el esquema aquí porque no podemos importar módulos TS en script JS simple fácilmente sin compilación
const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  type: { type: String, default: 'Newsletter' },
}, { timestamps: true, strict: false }); // strict false para leer otros campos si existen

const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

async function checkCustomers() {
  console.log("Conectando a DB...");
  const uri = process.env.MONGODB_URI || "mongodb+srv://admin:admin123@cluster0.mongodb.net/test"; // OJO: Necesito la URI real. 
  // Intentaré leer la URI del .env.local si es posible, o pedirle al usuario. 
  // No puedo leer .env.local automáticamente con require('dotenv') si no está instalado.
  // Asumiré que el usuario tiene las variables en su entorno o fallará.
  
  // Mejor estrategia: crear un endpoint temporal GET /api/debug-customers que liste los últimos 5
  // y lo llamo con fetch. Es más seguro y reutiliza la conexión del proyecto.
}
