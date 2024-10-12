import { type NextRequest, NextResponse } from "next/server";
import type { UserDataProps } from "~/lib/definitions";
import { getUserById, updateUser } from "~/server/queries";

export async function POST(req: NextRequest) {
  try {
    const user = (await req.json()) as UserDataProps;
    
    // Validate required fields (optional, but useful)
    if (!user.id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Attempt to update the user
    await updateUser(user);

    // Fetch the updated user data
    const updatedUser = await getUserById(user.id);

    // Respond with the updated user data
    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      role: updatedUser.role,
    }, { status: 200 });

  } catch (e) {
    console.error('Error updating user:', e);
    return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
  }
}
