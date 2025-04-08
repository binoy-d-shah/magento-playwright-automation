export const registrationTestData = {

    validUser: {
        message: 'Thank you for registering with Main Website Store'
    },
    existingEmail: {
        email: 'baka.poe@malinator.com',
        message: 'There is already an account with this email address.'
    },
    invalidEmail: {
        email: 'invalid-email',
        message: 'Please enter a valid email address'
    },
    weakPassword: {
        password: '123',
        message: 'Minimum length of this field must be equal or greater than 8 symbols.'
    },
    empltyFields: {
        message: 'This is a required field.'
    },
    mismatchedPassword: {
        password: 'DifferentPass!',
        message: 'Please enter the same value again.'
    }
    
};