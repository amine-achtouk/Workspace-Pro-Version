const Joi = require('joi');

const createNoteSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100).required().messages({
        'string.empty': 'Note title cannot be empty',
        'string.min': 'Note title must be at least 3 characters',
        'any.required': 'Title is required'
    }),
    content: Joi.string().trim().allow('').max(5000).messages({
        'string.max': 'Content cannot exceed 5000 characters'
    }),
});

const updateNoteSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100),
    content: Joi.string().trim().max(5000),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

module.exports = { createNoteSchema, updateNoteSchema };