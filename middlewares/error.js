module.exports = function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);

    // render error for API or normal
    if (req.originalUrl.startsWith('/api')) {
        let message = err.message || 'Something failed.';
        if (err.status === 404) {
            message = 'Not found.';
        }
        return res.json({
            success: false,
            message
        });
    } else {
        return res.render('error');
    }
}