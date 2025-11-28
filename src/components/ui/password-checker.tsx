import React from 'react';

// Define a type/interface for the props for better readability and reusability
export interface PasswordValidity {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    specialChar: boolean;
}

// Use a functional component that accepts the props directly
export default function PasswordValidityChecker({ passwordValidity }: { passwordValidity: PasswordValidity }) {
    return (
        <div className="mt-2 text-sm">
            <ul className="space-y-1">
                <li className="flex items-center">
                    {/* Access props directly */}
                    <span className={`inline-block w-4 text-center ${passwordValidity.minLength ? "text-green-500" : "text-destructive"}`}>{passwordValidity.minLength ? "✓" : "✗"}</span>
                    <span className={`ml-1 ${passwordValidity.minLength ? "text-green-500" : "text-muted-foreground"}`}>At least 8 characters</span>
                </li>
                <li className="flex items-center">
                    <span className={`inline-block w-4 text-center ${passwordValidity.uppercase ? "text-green-500" : "text-destructive"}`}>{passwordValidity.uppercase ? "✓" : "✗"}</span>
                    <span className={`ml-1 ${passwordValidity.uppercase ? "text-green-500" : "text-muted-foreground"}`}>An uppercase letter</span>
                </li>
                <li className="flex items-center">
                    <span className={`inline-block w-4 text-center ${passwordValidity.lowercase ? "text-green-500" : "text-destructive"}`}>{passwordValidity.lowercase ? "✓" : "✗"}</span>
                    <span className={`ml-1 ${passwordValidity.lowercase ? "text-green-500" : "text-muted-foreground"}`}>A lowercase letter</span>
                </li>
                <li className="flex items-center">
                    <span className={`inline-block w-4 text-center ${passwordValidity.number ? "text-green-500" : "text-destructive"}`}>{passwordValidity.number ? "✓" : "✗"}</span>
                    <span className={`ml-1 ${passwordValidity.number ? "text-green-500" : "text-muted-foreground"}`}>A number</span>
                </li>
                <li className="flex items-center">
                    <span className={`inline-block w-4 text-center ${passwordValidity.specialChar ? "text-green-500" : "text-destructive"}`}>{passwordValidity.specialChar ? "✓" : "✗"}</span>
                    <span className={`ml-1 ${passwordValidity.specialChar ? "text-green-500" : "text-muted-foreground"}`}>A special character (@$!%*?&)</span>
                </li>
            </ul>
        </div>
    );
}