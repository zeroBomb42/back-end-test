import * as Joi from 'joi';

export const getProductSchema = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().optional(),
  // Add other fields as needed
});

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  // Add other fields as needed
});

export const updateProductSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().optional(),
  // Add other fields as needed
});