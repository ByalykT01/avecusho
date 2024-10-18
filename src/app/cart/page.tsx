import CartItems from "~/components/cart-items-page";
import { auth } from "auth";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/auth/login");
  }

  return (
    <main className="mx-auto flex w-[90%] flex-col">
      <p className="mx-auto text-3xl">Cart</p>
      <CartItems userId={userId} />
    </main>
  );
}
