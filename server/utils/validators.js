'use strict';

const validate = require('mongoose-validator');

const nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    })
];

const emailValidator = [
    validate({
        validator: 'isEmail',
        passIfEmpty: false,
        message: 'Please put a proper email id'
    })
];

const phoneNumberValidator = [
    validate({
        validator: 'isMobilePhone',
        passIfEmpty: false,
        arguments: [true],
        message: "Please put a proper phone number"
    })
];

const urlValidator = [
    validate({
        validator: 'isURL',
        message: 'provide a valid url'
    })
];

const floatValidator = [
    validate({
        validator: 'isFloat',
        message: 'input float'
    })
];


// const passwordValidator = [
//     validate({
//         validator: 'isStrongPassword',
//         message: 'Please provide a strong password'
//     })
// ]

module.exports = {
    nameValidator,
    emailValidator,
    phoneNumberValidator,
    floatValidator,
    urlValidator
};
