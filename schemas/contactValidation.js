const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/)
    .messages({ "string.pattern.base": `Phone number must be in the valid format (###) ###-####.` })
    .required(),
});

module.exports = { contactSchema };
