
async function testSubscribe() {
  console.log("Iniciando prueba de suscripción...");
  const url = 'http://localhost:3000/api/subscribe';
  
  const payload = {
    name: "Test User Automático",
    email: `test_auto_${Date.now()}@example.com`,
    city: "Ciudad Gótica",
    phone: "123456789",
    company: "Wayne Enterprises",
    message: "Prueba automática de suscripción",
    type: "Distributor"
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log(`Status Code: ${response.status}`);
    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    if (response.ok) {
        console.log("✅ Prueba EXITOSA: El usuario debería haberse creado.");
    } else {
        console.log("❌ Prueba FALLIDA: El servidor devolvió un error.");
    }

  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    if(error.cause) console.error("Causa:", error.cause);
  }
}

testSubscribe();
