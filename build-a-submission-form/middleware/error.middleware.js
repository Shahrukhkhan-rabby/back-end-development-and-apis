export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

export const finalErrorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    console.error(err);

    const message = statusCode === 500
        ? "Internal Server Error (Check Server Logs)"
        : err.message;

    res.status(statusCode).json({
        error: true,
        status: statusCode,
        message: message
    });
};