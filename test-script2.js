const fs = require('fs');

async function test() {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const env = {};
    envFile.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) env[match[1]] = match[2].trim();
    });

    const SMM_API_URL = env['SMM_PROVIDER_API_URL'];
    const SMM_API_KEY = env['SMM_PROVIDER_API_KEY'];

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
