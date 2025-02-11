import * as Joi from 'joi';

export const getProductSchema = Joi.object({
  name: Joi.string().allow(''),
  price: Joi.number().allow(''),
});

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  prices: Joi.array()
    .items(
      Joi.object({
        amount: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
});

export const updateProductSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  prices: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().optional(),
        amount: Joi.number().required(),
      })
    )
    .optional(),
});

export const deleteProductSchema = Joi.object({
  productId: Joi.number().required(),
});

export const deletePriceSchema = Joi.object({
  productId: Joi.number().required(),
  priceId: Joi.number().required(),
});