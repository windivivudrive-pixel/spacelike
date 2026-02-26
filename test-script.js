require('dotenv').config({ path: '.env.local' });

async function test() {
    const SMM_API_URL = process.env.SMM_PROVIDER_API_URL;
    const SMM_API_KEY = process.env.SMM_PROVIDER_API_KEY;

    if (!SMM_API_URL || !SMM_API_KEY) {
        console.log("Missing credentials format");
        return;
    }

    const payload = new URLSearchParams({
        key: SMM_API_KEY,
        action: 'balance',
    });

    const res = await fetch(SMM_API_URL, {
        method: 'POST',
        body: payload,
    });

    const data = await res.json();
    console.log("API Response:");
    console.log(data);
}
test();
