import Joi from 'joi';

export const projectSchema = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string().allow(null, '').optional(),
});
