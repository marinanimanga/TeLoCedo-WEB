import crypto from 'crypto';

class PasswordHashing {
    static generateSalt() {
        return crypto.randomBytes(16);
        
    }

    static hashPassword(password, salt) {
        try {
            const hashedBytes = crypto.createHash('sha256').update(Buffer.concat([Buffer.from(password), salt])).digest();
            return hashedBytes.toString('base64');
            
        } catch (error) {
            console.error("Error al codificar la contraseña:", error);
            return null;
        }
    }
}

export {PasswordHashing as default};
