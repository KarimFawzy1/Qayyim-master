import { requireAuth } from "@/lib/middleware";
import { NextRequest } from "next/server";
import {prisma} from "@/lib/prisma";
import {handleApiError, successResponse} from "@/lib/api-response";
import {comparePassword, validatePassword} from "@/lib/auth";

export async function DELETE(request: NextRequest) {
    try {
        const authUser = requireAuth(request);

        const body = await request.json();

        const {password} = body;

        const user = await prisma.user.findUnique({where: {id: authUser.userId}});

        if (!user) throw new Error("User not found");

        if (!password) {
            throw new Error("Password is required");
        }

        const validatedPassword = validatePassword(password);

        if (!validatedPassword.isValid) {
            throw new Error(validatedPassword.errors.join(", "));
        }

        const isPasswordCorrect = await comparePassword(password, user.password);

        if (!isPasswordCorrect) {
            throw new Error("Password is incorrect");
        }

        await prisma.user.delete({
            where: { id: authUser.userId }
        });


        return successResponse(null, 'Account deleted successfully', 204);
    } catch (e) {
        return handleApiError(e);
    }
}