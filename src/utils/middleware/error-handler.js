async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    let { status = 500, message, details } = err;
    ctx.status = status;
    ctx.body = {
      error: { message, status, details },
    };

    ctx.app.emit("error", err, ctx);
  }
}

module.exports = errorHandler;
