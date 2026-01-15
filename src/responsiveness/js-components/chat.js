// ==========================================
// DYNAWORKS CHAT API - Netlify Serverless Function
// Secure proxy to n8n webhook
// ==========================================

const rateLimit = new Map();

exports.handler = async (event, context) => {
    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://dynaworks.gr',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: ''
        };
    }

    // Only POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Origin check
    const origin = event.headers.origin || event.headers.Origin;
    const allowedOrigins = [
        'https://dynaworks.gr',
        'https://www.dynaworks.gr',
        'http://localhost:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ];

    if (origin && !allowedOrigins.includes(origin)) {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Forbidden' })
        };
    }

    // Rate limiting (10 requests per minute per IP)
    const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 10;

    if (!rateLimit.has(clientIP)) {
        rateLimit.set(clientIP, { count: 1, resetTime: now + windowMs });
    } else {
        const client = rateLimit.get(clientIP);
        if (now > client.resetTime) {
            client.count = 1;
            client.resetTime = now + windowMs;
        } else {
            client.count++;
            if (client.count > maxRequests) {
                return {
                    statusCode: 429,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        error: 'Πολλά αιτήματα. Περίμενε λίγο.',
                        error_en: 'Too many requests. Please wait.'
                    })
                };
            }
        }
    }

    try {
        const body = JSON.parse(event.body);
        let message = body.message || '';

        // Sanitize
        message = message.replace(/<[^>]*>/g, '').substring(0, 1000).trim();

        if (!message) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Message required' })
            };
        }

        // Get webhook URL from environment
        const webhookUrl = process.env.N8N_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('N8N_WEBHOOK_URL not configured');
            return {
                statusCode: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Service not configured' })
            };
        }

        // Call n8n
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                timestamp: new Date().toISOString(),
                source: 'dynaworks-website',
                ip: clientIP,
                userAgent: event.headers['user-agent']
            })
        });

        if (!response.ok) {
            throw new Error(`n8n responded with ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://dynaworks.gr'
            },
            body: JSON.stringify({
                success: true,
                reply: data.reply || data.output || data.text || 'Έλαβα το μήνυμά σου!'
            })
        };

    } catch (error) {
        console.error('Chat function error:', error);
        return {
            statusCode: 502,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'Υπηρεσία μη διαθέσιμη. Δοκίμασε ξανά.',
                error_en: 'Service unavailable. Please try again.'
            })
        };
    }
};