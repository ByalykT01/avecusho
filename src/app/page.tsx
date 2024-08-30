/** eslint-disable @next/next/no-img-element */
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await db.query.items.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });

  return (
    <main className="px-5 sm:px-5 md:px-5 lg:px-10">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-8">
        {items.map((item) => (
          <div key={item.id}>
            <img
              className="h-[35vw] w-full object-cover sm:h-[30vw] md:h-[25vw] lg:h-[20vw]"
              src={item.url}
              alt="item"
            />
            <div className="h-1/7 bg-zinc-200">
              <div className="mx-2 flex items-center justify-between">
                <h2 className="font-bold sm:text-lg md:text-xl lg:text-2xl">
                  {item.name}
                </h2>
                <p className="text-[14px] text-[#767676]">
                  ${Math.floor(Math.random() * 1000000)}
                </p>
              </div>
              <div>
                <p className="ml-2 text-[14px] text-[#767676]">color</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
