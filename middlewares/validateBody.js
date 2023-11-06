const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, __, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (typeof error !== "undefined") {
      next(
        HttpError(
          400,
          `missing required name field: ${error.details.map((err) => err.message).join(", ")}`
        )
      );
    }
    next();
  };
  return func;
};

module.exports = validateBody;
