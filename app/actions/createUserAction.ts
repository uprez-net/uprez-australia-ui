import prisma from "@/lib/prisma";
import { UserData } from "../interface/interface";

export const createUserAction = async (userData: UserData) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                ...userData,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })

        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    }
}