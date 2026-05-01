//  API Configuration
//  backend: เปลี่ยน USE_MOCK เป็น false เมื่อหลังบ้านพร้อม
//  และตั้ง API_BASE_URL ให้ตรงกับ server ของตัวเอง

const API_BASE_URL = 'http://localhost:5000/api';
const USE_MOCK = false;

// GET  →  GET /api/<endpoint>
async function apiGet(endpoint) {
    const res = await fetch(API_BASE_URL + endpoint);
    if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
    return res.json();
}


// POST →  POST /api/<endpoint>   (ต้อง login ก่อน — ส่ง token ด้วย)
async function apiPost(endpoint, data) {
    const token = sessionStorage.getItem('authToken');
    try {
        const res = await fetch(API_BASE_URL + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `POST ${endpoint} failed: ${res.status}`);
        }
        return res.json();
    } catch (e) {
        alert(`Error: ${e.message}`);
        throw e;
    }
}

// DELETE → DELETE /api/<endpoint>   (ต้อง login ก่อน — ส่ง token ด้วย)
async function apiDelete(endpoint) {
    const token = sessionStorage.getItem('authToken');
    try {
        const res = await fetch(API_BASE_URL + endpoint, {
            method: 'DELETE',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `DELETE ${endpoint} failed: ${res.status}`);
        }
        return true;
    } catch (e) {
        alert(`Error: ${e.message}`);
        throw e;
    }
}


async function apiPostFormData(endpoint, formData) {
    const token = sessionStorage.getItem('authToken');
    try {
        const res = await fetch(API_BASE_URL + endpoint, {
            method: 'POST',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: formData
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `POST ${endpoint} failed: ${res.status}`);
        }
        return res.json();
    } catch (e) {
        alert(`Error: ${e.message}`);
        throw e;
    }
}