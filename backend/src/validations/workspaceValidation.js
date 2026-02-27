const Joi = require('joi');

const workspaceSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'Workspace name is required',
        'string.min': 'Workspace name must be at least 2 characters long',
        'any.required': 'Name is a mandatory field'
    }),
});

module.exports = { workspaceSchema };