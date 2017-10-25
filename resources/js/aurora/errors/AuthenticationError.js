class AuthenticationError extends Error {
    constructor(message) {
        super('Failed to authenticate user: ' + message);
        this.name = 'AuthenticationError';
    }
}

export default AuthenticationError;