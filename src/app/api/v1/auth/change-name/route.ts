import {NextRequest} from "next/server";
import {requireAuth} from "@/lib/middleware";
import {prisma} from "@/lib/prisma";
import {handleApiError, successResponse} from "@/lib/api-response";

export async function PATCH(request: NextRequest) {
    try {
        const authUser = requireAuth(request);
        const body = await request.json();

        const {name} = body;

        if (!name || name.trim() === '') throw new Error('Name is required');

        const updatedUser = await prisma.user.update(
            {
                where: {id: authUser.userId},
                data: {name: name.trim()},
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            }
        );

        return successResponse(updatedUser, "Name updated successfully.");
    } catch (e) {
        return handleApiError(e);
    }
}