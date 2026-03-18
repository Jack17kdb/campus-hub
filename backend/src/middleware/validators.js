import { body, query, param, validationResult } from 'express-validator';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            errors: errors.array()
        });
    }
    next();
};

export const registerValidator = [
    body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 3 }).escape(),
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('studentId').trim().notEmpty().withMessage('Student ID is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    validate
];

export const loginValidator = [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

export const forgotPasswordValidator = [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    validate
];

export const resetPasswordValidator = [
    query('token').notEmpty().withMessage('Token is required').trim(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    validate
];

export const sendMessageValidator = [
    param('id').isMongoId().withMessage('Invalid receiver ID'),
    body('text').optional().trim().escape(),
    body().custom((value, { req }) => {
        if (!req.body.text && !req.body.image) {
            throw new Error('Message cannot be empty');
        }
        return true;
    }),
    validate
];

export const createItemValidator = [
    body('title').trim().notEmpty().withMessage('Title is required').escape(),
    body('description').trim().notEmpty().withMessage('Description is required').escape(),
    body('image').notEmpty().withMessage('Image is required'),
    body('intention').isIn(['selling', 'donating', 'trading']).withMessage('Invalid intention'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').if(body('intention').equals('selling'))
        .isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
    validate
];

export const searchValidator = [
    query('query').trim().notEmpty().withMessage('Search term is required').escape(),
    validate
];

export const mongoIdValidator = [
    param('id').isMongoId().withMessage('Invalid ID format'),
    validate
];
