const sessionCheckMiddleware = (req, res, next) => {
    if (!req.session || !req.session._id) {
        return res.redirect('/login');
    }
    next();
};

export default sessionCheckMiddleware;