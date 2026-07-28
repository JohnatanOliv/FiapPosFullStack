const crypto = require('crypto');

const TOKEN_TTL_SECONDS = 60 * 60 * 12;
const SECRET = process.env.AUTH_SECRET || 'blogschool-dev-secret';

const toBase64Url = (value) => Buffer.from(value).toString('base64url');
const fromBase64Url = (value) => Buffer.from(value, 'base64url').toString('utf8');

const sign = (payloadPart) => {
    return crypto.createHmac('sha256', SECRET).update(payloadPart).digest('base64url');
};

const issueAuthToken = (user) => {
    const payload = {
        id: String(user._id),
        role: user.role || 'teacher',
        exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    };

    const payloadPart = toBase64Url(JSON.stringify(payload));
    const signaturePart = sign(payloadPart);
    return `${payloadPart}.${signaturePart}`;
};

const verifyAuthToken = (token) => {
    if (!token || !token.includes('.')) return null;

    const [payloadPart, signaturePart] = token.split('.');
    if (!payloadPart || !signaturePart) return null;

    const expected = sign(payloadPart);
    if (signaturePart !== expected) return null;

    try {
        const payload = JSON.parse(fromBase64Url(payloadPart));
        if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
        if (!payload.id || !payload.role) return null;
        return payload;
    } catch {
        return null;
    }
};

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const [, token] = authHeader.split(' ');

    const payload = verifyAuthToken(token);
    if (!payload) {
        return res.status(401).json({ success: false, message: 'Não autenticado.' });
    }

    req.auth = payload;
    return next();
};

const requireRole = (...roles) => {
    return (req, res, next) => {
        const role = req.auth?.role;
        if (!role || !roles.includes(role)) {
            return res.status(403).json({ success: false, message: 'Sem permissão para esta ação.' });
        }
        return next();
    };
};

module.exports = { issueAuthToken, requireAuth, requireRole };
