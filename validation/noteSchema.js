const { checkSchema } = require("express-validator");

exports.createNoteSchema = checkSchema({
    title: {
        in: ['body'],
        optional: { options: { nullable: true } },
        customSanitizer: {
            options: (value) => {
                if (!value || typeof value !== 'string' || value.trim() === '') {
                    return ''
                }
                return value;
            }
        },
        trim: true,
    },

    notecontent: {
        in: ['body'],
        optional: { options: { nullable: true } },
        customSanitizer: {
            options: (value) => {
                if (!value || typeof value !== 'string' || value.trim() === '') {
                    return ''
                }
                return value;
            }
        },
    }
});

exports.updateNoteSchema = checkSchema({
    id: {
        in: ['params'],
        notEmpty: {
            errorMessage: "id is required",
        },
        toInt: true,
        trim: true,
        escape: true,
    },

    title: {
        in: ['body'],
        optional: { options: { nullable: true } },
        customSanitizer: {
            options: (value) => {
                if (!value || typeof value !== 'string' || value.trim() === '') {
                    return ''
                }
                return value;
            }
        },
        trim: true,
    },

    notecontent: {
        in: ['body'],
        optional: { options: { nullable: true } },
        customSanitizer: {
            options: (value) => {
                if (!value || typeof value !== 'string' || value.trim() === '') {
                    return ''
                }
                return value;
            }
        },
    }
});

exports.deleteNoteSchema = checkSchema({
    id: {
        in: ['params'],
        notEmpty: {
            errorMessage: "id is required",
        },
        toInt: true,
        trim: true,
        escape: true,
    }
});

exports.getNoteSchema = checkSchema({
    id: {
        in: ['params'],
        notEmpty: {
            errorMessage: "id is required",
        },
        toInt: true,
        trim: true,
        escape: true,
    }
});