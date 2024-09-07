import Joi from "joi";

export default Joi.object({
  title: Joi.string().max(15).required().messages({
    "string.base": "The title must be of type string",
    "string.max": "Title has to be 100 characters or less"
  }),
  description: Joi.string().required().messages({
    "string.base": "The description must be of type string"
  }),
  reference: Joi.string().min(10).max(10).required().messages({
    "string.base": "Reference must be of type string",
    "string.min": "Reference must be 10 characters long.",
    "string.max": "Reference must be 10 characters long.",
  }),
  ean: Joi.string().min(13).max(13).required().messages({
    "string.base": "The EAN must be of type string",
    "string.min": "Please provide a correct EAN",
    "string.max": "Please provide a correct EAN",
  }),
  length: Joi.number().required().messages({
    "number.base": "The length must be of type number"
  }),
  width: Joi.number().required().required().messages({
    "number.base": "The width must be of type number"
  }),
  height: Joi.number().required().messages({
    "number.base": "The length must be of type number"
  }),
  product_image_url: Joi.string().required().messages({
    "string.base": "The product image link must be of type string"
  }),
  price: Joi.number().required().messages({
    "number.base": "The price must be of type number"
  }),
  product_blockage_name: Joi.string().min(3).max(3).optional().messages({
    "string.base": "The product blockage code name must be of type string",
    "string.min": "The product blockage code name must be 3 characters long",
    "string.max": "The product blockage code name must be 3 characters long",
  })
})