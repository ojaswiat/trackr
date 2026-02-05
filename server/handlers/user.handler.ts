import type { TUserProfile } from "~~/shared/schemas/zod.schema";
import type { TUser } from "~~/shared/types/entity.types";
import { eq } from "drizzle-orm";
import { db } from "~~/server/utils/db";
import { users } from "~~/shared/db/schema";

export async function getUser(userId: string): Promise<TUser> {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

    if (!user) {
        throw new Error("User not found");
    }

    return {
        id: user.id,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email,
        currency: user.currency,
        is_demo: user.is_demo,
    };
}

export async function updateUser(
    userId: string,
    payload: TUserProfile,
): Promise<TUser> {
    const [updatedUser] = await db
        .update(users)
        .set({
            first_name: payload.first_name,
            last_name: payload.last_name,
            currency: payload.currency ?? undefined,
        })
        .where(eq(users.id, userId))
        .returning();

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return {
        id: updatedUser.id,
        first_name: updatedUser.first_name || "",
        last_name: updatedUser.last_name || "",
        email: updatedUser.email,
        currency: updatedUser.currency,
    };
}

export async function deleteUser(userId: string): Promise<void> {
    // Due to ON DELETE CASCADE in schema, this will automatically remove
    // accounts and transactions associated with the user.
    await db.delete(users).where(eq(users.id, userId));
}

export async function isDemoUser(userId: string): Promise<boolean> {
    const [user] = await db
        .select({
            is_demo: users.is_demo,
        })
        .from(users)
        .where(eq(users.id, userId));

    if (!user) {
        throw new Error("User not found");
    }

    return user.is_demo ?? false;
}
