import { auth } from "auth";
import { redirect } from "next/navigation";
import CartItems from "~/components/cart/cart-page";

export default async function CartPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/auth/login");
  }

  return (
    <main className="mx-auto flex w-[90%] flex-col">
      <h1 className="relative mb-10 text-center text-4xl font-bold text-gray-800">
        Cart
      </h1>
      <CartItems userId={userId} />
    </main>
  );
}
