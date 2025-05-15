const { checkSchema } = require("express-validator");

exports.createUserSchema = checkSchema({
    firstname: {
        in: ['body'],

        notEmpty: {
            errorMessage: "First Name Is Required",
        },

        isString: {
            errorMessage: "name must be A String",
        },

        isLength: {
            options: {min: 3, max: 19},
            errorMessage: 'Name must be between 3 and 19 characters',
        },

        trim: true,
        escape: true

    },

    lastname: {
        in: ['body'],

        notEmpty: {
            errorMessage: "Last Name is required",
        },

        isString: {
            errorMessage: "Last Name must be A string",
        },

        isLength: {
            options: {min: 3, max: 19},
            errorMessage: 'Name must be between 3 and 19 characters',
        },

        trim: true,
        escape: true

    },

    email: {
        in: ['body'],

        notEmpty: {
            errorMessage: "First Name Is Required",
        },

        isString: {
            errorMessage: "Email must Be A String",
        },

        isEmail: {
            errorMessage: "Invalid email",
        },

        trim: true,
        normalizeEmail: true,
        escape: true

    },

    userPassword: {
        in: ['body'],

        notEmpty: {
            errorMessage: "Password Name Is Required",
        },

        isString: {
            errorMessage: "Password must be A String",
        },

        isLength: {
            options: {min: 4},
            errorMessage: 'password charachter length must be greater 4',
        },

        trim: true,
        escape: true
    }
});

exports.loginUserSchema = checkSchema({
    email: {
        in: ['body'],

        notEmpty: {
            errorMessage: "Email Is Required",
        },

        isString: {
            errorMessage: "Email must Be A String",
        },

        isEmail: {
            errorMessage: "Invalid email",
        },

        trim: true,
        normalizeEmail: true,
        escape: true

    },

    userPassword: {
        in: ['body'],

        notEmpty: {
            errorMessage: "Password Name Is Required",
        },

        isString: {
            errorMessage: "Password must be A String",
        },

        isLength: {
            options: {min: 4},
            errorMessage: 'password charachter length must be greater 4',
        },

        trim: true,
        escape: true
    }
});