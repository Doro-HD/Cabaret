import { db } from "../..";
import { userTable, type User } from "./schema";

export async function createUser(user: User): Promise<boolean> {
    try {
        await db.insert(userTable).values(user);

        return true;
    } catch {
        return false;
    }
}