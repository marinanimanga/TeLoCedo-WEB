import PasswordHashing from './PasswordHashing.js';

class Authentication {
    static authenticate(password, storedPasswordHash, storedSalt) {
        const hashedAttempt = PasswordHashing.hashPassword(password, storedSalt);
        return storedPasswordHash === hashedAttempt;
    }
}

export {Authentication as default};
