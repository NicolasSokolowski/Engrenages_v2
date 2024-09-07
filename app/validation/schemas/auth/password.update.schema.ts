import Joi from "joi";

export default Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.base": "The current password must be of type string"
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.base": "The new password must be of type string",
    "string.min": "The new password must be 8 characters long or more"
  })
})