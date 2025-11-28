export interface PasswordValidation {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    specialChar: boolean;
}

export function validatePasswordClient(password: string): PasswordValidation {
    return {
        minLength: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        specialChar: /[@$!%*?&]/.test(password),
    };
}

export function isPasswordValid(validation: PasswordValidation): boolean {
    return Object.values(validation).every(v => v === true);
}