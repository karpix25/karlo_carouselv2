const yd = require("@bedrockio/yada");

function resolveSchema(arg) {
  return yd.isSchema(arg) ? arg : yd.object(arg);
}

function validateBody(arg) {
  const schema = resolveSchema(arg);
  return wrapSchema(schema, "body", async (ctx, next) => {
    try {
      const { authUser } = ctx.state;
      ctx.request.body = await schema.validate(ctx.request.body, {
        ...ctx.state,
        scopes: authUser?.getScopes(),
      });
    } catch (error) {
      ctx.throw(400, error.message, { details: error.details });
    }
    return await next();
  });
}

function wrapSchema(schema, type, fn) {
  // Allows docs to see the schema on the middleware
  // layer to generate an OpenApi definition for it.
  fn.validation = {
    type,
    schema,
  };
  return fn;
}

module.exports = {
  validateBody,
};
