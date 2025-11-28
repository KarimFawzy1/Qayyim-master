// src/services/auth/authService.ts
function getToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

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

export async function getCurrentUser() {
    try {
        const token = getToken();

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch('/api/v1/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch user data');
        }

        return result.data; // Return the user data from the response
    } catch (error: any) {
        console.error('Error fetching current user:', error);
        throw error;
    }
}

export async function changeName(data: {name: string }) {
    try {
        const token = getToken();

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch('/api/v1/auth/change-name', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch user data');
        }

        return result.data;
    } catch (error: any) {
        console.error('Error updating name:', error);
        throw error;
    }
}

export async function changePassword(data: {currentPassword: string, newPassword: string, confirmPassword: string}) {
    try {
        const token = getToken();

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch('/api/v1/auth/change-password', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to change password, please ensure password you entered is correct');
        }

        return result.data;
    } catch (error: any) {
        console.error('Error changing password:', error);
        throw error;
    }
}

export function logoutUser() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
}

export async function deleteAccount(data: { password: string }) {
    try {
        const token = getToken();

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch('/api/v1/auth/delete-account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });

        // Check for 204 first - before trying to parse anything
        if (response.status === 204) {
            logoutUser();
            return 'Account deleted successfully.';
        }

        // Only try to parse JSON if we didn't get a 204
        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            // If JSON parsing fails but response was ok, still logout
            if (response.ok) {
                logoutUser();
                return 'Account deleted successfully.';
            }
            throw new Error('Failed to delete account - invalid response from server');
        }

        if (!response.ok) {
            throw new Error(result.message || 'Failed to delete account');
        }

        logoutUser();
        return result.message || 'Account deleted successfully.';

    } catch (error: any) {
        console.error('Error deleting account:', error);
        throw error;
    }
}