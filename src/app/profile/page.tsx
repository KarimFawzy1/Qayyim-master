'use client';

import {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {PageHeader} from "@/components/page-header";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {changeName, changePassword, getCurrentUser, logoutUser, deleteAccount} from "@/services/authService";
import PasswordValidityChecker from "@/components/ui/password-checker";
import {isPasswordValid, validatePasswordClient} from "@/lib/validate-password-client";
import {useRouter} from 'next/navigation';

export default function StudentProfilePage() {
    const router = useRouter();

    const [user, setUser] = useState({name: '', email: ''});
    const [loading, setLoading] = useState(true);
    const [nameField, setNameField] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [updating, setUpdating] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
    const [passwordValidity, setPasswordValidity] = useState({
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    // 🔑 ADDED: State for Delete Account confirmation
    const [deletePassword, setDeletePassword] = useState<string>('');
    const [deleteError, setDeleteError] = useState<string>('');
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    useEffect(() => {
        async function loadUser() {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
                setNameField(userData.name); // Initialize nameField with current name
            } catch (error) {
                console.error('Failed to load user:', error);
                // 🔑 REDIRECT ON FAILED AUTH: If fetching the user fails (token expired/invalid), log out and redirect
                logoutUser();
                router.push('/');
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    const handleNameChange = async () => {
        setNameError(''); // Clear previous errors

        // Validation
        if (!nameField || nameField.trim() === '') {
            setNameError("Name cannot be empty");
            return;
        }

        if (nameField === user.name) {
            setNameError("Please enter a different name");
            return;
        }

        setSaving(true);

        try {
            const updatedUser = await changeName({name: nameField});
            setUser(updatedUser); // Update the user state with the new data
            setNameError(''); // Clear any errors
            console.log('Name updated successfully:', updatedUser);
        } catch (e: any) {
            console.error(e);
            setNameError(e.message || 'Failed to update name');
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmPassword = async () => {
        setConfirmPasswordError('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setConfirmPasswordError('Please fill all fields');
            return;
        }

        if (confirmPassword !== newPassword) {
            setConfirmPasswordError('passwords do not match');
            return;
        }

        const validatedPassword = validatePasswordClient(newPassword);

        if (!isPasswordValid(validatedPassword)) {
            setConfirmPasswordError('Password is invalid, please ensure your password meets all the requirements.');
            return;
        }

        setUpdating(true);

        try {
            await changePassword({
                currentPassword,
                newPassword,
                confirmPassword
            });

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            alert('Password updated successfully!');
        } catch (e: any) {
            console.error('Password change error:', e);
            setConfirmPasswordError(e.message);
        } finally {
            setUpdating(false);
        }
    }

    const handleLogout = () => {
        logoutUser(); // Remove the token
        router.push('/'); // Redirect to the home page
    };

    // 🔑 ADDED: Delete Account Handler
    const handleDeleteAccount = async () => {
        setDeleteError('');

        if (!deletePassword) {
            setDeleteError('Please enter your password to confirm deletion.');
            return;
        }

        setDeleting(true);

        try {
            // 1. Call the service function
            await deleteAccount({password: deletePassword});

            alert('Your account has been successfully deleted.');
            router.push('/');

        } catch (e: any) {
            console.error('Deletion error:', e);
            setDeleteError(e.message || 'An unknown error occurred during deletion.');
        } finally {
            setDeleting(false);
        }
    };


    if (loading) {
        return <div className="flex flex-1 items-center justify-center">Loading...</div>;
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <PageHeader
                title="My Profile"
                description="Manage your account settings and personal information."
            />

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Personal Information</CardTitle>
                            <CardDescription>Update your name and email address.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={nameField}
                                    onChange={(e) => setNameField(e.target.value)}
                                    disabled={saving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email"
                                       type="email"
                                       value={user.email}
                                       readOnly/>
                            </div>
                            <Button onClick={handleNameChange}
                                    disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            {nameError && (
                                <p className="text-sm text-red-600">{nameError}</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="font-headline">Change Password</CardTitle>
                            <CardDescription>Set a new password for your account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password"
                                       type="password"
                                       value={currentPassword}
                                       onChange={(e) => setCurrentPassword(e.target.value)}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password"
                                       type="password"
                                       value={newPassword}
                                       onChange={(e) => {
                                           const newPassword = e.target.value;
                                           setNewPassword(newPassword);
                                           setPasswordValidity({
                                               minLength: newPassword.length >= 8,
                                               uppercase: /[A-Z]/.test(newPassword),
                                               lowercase: /[a-z]/.test(newPassword),
                                               number: /[0-9]/.test(newPassword),
                                               specialChar: /[@$!%*?&]/.test(newPassword),
                                           });
                                       }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password"
                                       type="password"
                                       value={confirmPassword}
                                       onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleConfirmPassword}
                                    disabled={updating}>{updating ? 'Updating...' : 'Update Password'}</Button>

                            <PasswordValidityChecker passwordValidity={passwordValidity}/>
                            {confirmPasswordError && (
                                <p className="text-sm text-red-600">{confirmPasswordError}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 🔑 UPDATED JSX: Manage Account Card with Confirmation Modal Logic */}
                    <Card className="mt-6 border-red-500 border-2">
                        <CardHeader>
                            <CardTitle className="font-headline text-red-600">Account Actions</CardTitle>
                            <CardDescription>Actions related to account termination or logging out.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Toggle between initial buttons and the confirmation form */}
                            {showDeleteModal ? (
                                <div className="space-y-4 p-4 border border-red-300 rounded-md">
                                    <p className="text-sm font-semibold text-red-600">
                                        ⚠️ CONFIRMATION: This action is permanent. Enter your password to delete your
                                        account.
                                    </p>
                                    <div className="space-y-2">
                                        <Label htmlFor="delete-password">Current Password</Label>
                                        <Input
                                            id="delete-password"
                                            type="password"
                                            value={deletePassword}
                                            onChange={(e) => setDeletePassword(e.target.value)}
                                            disabled={deleting}
                                        />
                                    </div>
                                    {deleteError && (
                                        <p className="text-sm text-red-600">{deleteError}</p>
                                    )}
                                    <div className="flex gap-4">
                                        <Button onClick={handleDeleteAccount}
                                                variant="destructive"
                                                disabled={deleting}>
                                            {deleting ? 'Deleting...' : 'Confirm Delete'}
                                        </Button>
                                        <Button onClick={() => setShowDeleteModal(false)}
                                                variant="outline"
                                                disabled={deleting}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <Button onClick={handleLogout}
                                            variant="default">
                                        Log Out
                                    </Button>
                                    {/* 🔑 TRIGGER: Shows the confirmation form */}
                                    <Button onClick={() => setShowDeleteModal(true)}
                                            variant="destructive">
                                        Delete Account
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src="https://placehold.co/200x200"
                                             data-ai-hint="user avatar"/>
                                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline">Upload New Picture</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}