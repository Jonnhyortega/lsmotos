
async function checkDB() {
    try {
        const res = await fetch('http://localhost:3000/api/test-db');
        const data = await res.json();
        console.log("Estado de la DB:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error checking DB:", e);
    }
}
checkDB();
