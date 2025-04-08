export const loginTestData = {

    invalidPassword: {
        password: 'WrongPassword123',
        errorMessage: 'The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.'
    },
    unregisteredUser: {
        email: 'unregistered@example.com',
        password: 'AnyPassword123',
        errorMessage: 'The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.'
    },
    emptyCredentials: {
        email: '',
        password: '',
        errorMessage: 'This is a required field.'
    },
    invalidEmailFormat: {
        email: 'tt@dd',
        password: '123',
        errorMessage: 'Please enter a valid email address'
    },
    logoutMessage: 'You are signed out'
};