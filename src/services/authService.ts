// src/services/auth/authService.ts
export async function registerUser(data: { name: string; email: string; password: string; role: string }) {
    try {
        // Ensure role is lowercase for backend compatibility
        const normalizedRole = data.role;
        const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, role: normalizedRole }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || result.error || 'Registration failed');
        }

        return result;
    } catch (error: any) {
        console.error('Error in registerUser:', error);
        throw error;
    }
}

export async function loginUser(data: { email: string; password: string }) {
    try {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || result.error || 'Login failed');
        }

        return result;
    } catch (error: any) {
        console.error('Error in loginUser:', error);
        throw error;
    }
}
