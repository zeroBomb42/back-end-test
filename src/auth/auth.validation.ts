import * as Joi from 'joi';

export const loginSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
});

export const registerSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
});