
async function checkAdminCustomers() {
    try {
        const res = await fetch('http://localhost:3000/api/admin/customers');
        if (!res.ok) {
            console.log("Error status:", res.status);
            const text = await res.text();
            console.log("Error body:", text);
            return;
        }
        const data = await res.json();
        console.log("Admin Customers:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error checking Admin Customers:", e);
    }
}
checkAdminCustomers();
