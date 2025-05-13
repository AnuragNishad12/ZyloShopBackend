import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token); // Debug
        console.log('Server time:', new Date().toISOString()); // Debug

        const decoded = jwt.verify(token, process.env.JWT_SECRET, { clockTolerance: 30 });

        const userId = decoded._id || decoded.userId;

        if (!userId) {
            return res.status(401).json({
                message: 'Invalid token format: user ID not found in token'
            });
        }

        req.user = { _id: userId }; // Normalize to `_id` for rest of app
        next();

    } catch (error) {
        console.error('Auth middleware error:', error.name, error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token has expired',
                error: error.message,
                expiredAt: error.expiredAt
            });
        }
        return res.status(401).json({
            message: 'Invalid or expired token',
            error: error.message
        });
    }
};

export default auth;