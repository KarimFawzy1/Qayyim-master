import {NextRequest} from "next/server";
import {requireAuth} from "@/lib/middleware";
import {comparePassword, hashPassword, validatePassword} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {handleApiError, successResponse} from "@/lib/api-response";

export async function PATCH(request: NextRequest) {
    try {
        const authUser = requireAuth(request);
        const body = await request.json();

        const {currentPassword, newPassword, confirmPassword} = body;

        // Throw errors instead of returning responses
        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new Error("All password fields are required");
        }

        if (newPassword !== confirmPassword) {
            throw new Error("New passwords do not match");
        }

        const validatedPassword = validatePassword(newPassword);

        if (!validatedPassword.isValid) {
            // For validation errors with multiple messages, you might want to join them
            throw new Error(validatedPassword.errors.join(", "));
        }

        const user = await prisma.user.findUnique({where: {id: authUser.userId}});

        if (!user) {
            throw new Error("User not found");
        }

        const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: {id: authUser.userId},
            data: {password: hashedPassword},
        });

        return successResponse(null, 'Password updated successfully');
    } catch (error) {
        return handleApiError(error);
    }
}