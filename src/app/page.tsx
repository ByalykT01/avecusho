/** eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

const mockUrls = [
  // "https://utfs.io/f/86c1ee30-c8e6-4b94-922b-bd05dcf96ee3-zczyo4.jpg",
  // "https://utfs.io/f/dfddd8f0-774e-43c7-9044-d940081a6749-zd0lk7.jpg",
  // "https://utfs.io/f/241d93be-c8db-4aa8-8197-e200c371185c-zd0lmo.jpg",
  // "https://utfs.io/f/f4ba926b-70e9-4a65-8d20-2fe42f04537e-zczyp1.jpg",
  // "https://utfs.io/f/d13a371e-a85c-4660-b8a5-7a1c3205c537-zczyov.jpg",
  // "https://utfs.io/f/975decaf-b748-4f13-b3bc-ca937ba284d0-zczynd.jpg",
  "https://utfs.io/f/7fca9e24-cb33-4310-9201-8591419154f4-icslmh.webp",
  "https://utfs.io/f/6da20e34-3675-49b9-ab39-c4ec1fe07d74-rq6ie.webp",
  "https://utfs.io/f/ee93d308-9c36-45c4-8ab7-aea5e66047ae-rq6ic.webp",
  "https://utfs.io/f/6ee05138-af6b-4505-a90b-ed6761dce974-rq6ib.webp",
  "https://utfs.io/f/c65c9f55-0f60-43d0-bae4-3bb91fe1a505-rq6id.webp",
];

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

export default async function HomePage() {
  const posts = await db.query.posts.findMany();

  return (
    <main className="px-5 sm:px-5 md:px-5 lg:px-10">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-8">
        {/* {posts.map((post) => (
        <p key={post.id}>{post.name}</p>
      ))} */}
        {[...mockImages, ...mockImages, ...mockImages, ...mockImages].map(
          (image) => (
            <div key={image.id}>
              <img
                className="h-[35vw] w-full object-cover sm:h-[30vw] md:h-[25vw] lg:h-[20vw]"
                src={image.url}
                alt="image"
              />

              <div className="h-1/7  bg-zinc-200">
                <div className="mx-2 flex items-center justify-between">
                  <h2 className="font-bold sm:text-lg md:text-xl lg:text-2xl">
                    {"kitty num. " + image.id.toString()}
                  </h2>
                  <p className="text-[14px] text-[#767676]">
                    ${Math.floor(Math.random() * 1000000)}
                  </p>
                </div>
                <div>
                  <p className="ml-2 text-[14px] text-[#767676]">color</p>
                </div>
              </div>

              {/* <Image
              src={image.url}
              width={250}
              height={250}
              alt="image"
              style={{ objectFit: "contain" }}
              className="max-h-full max-w-full"
            /> */}
            </div>
          ),
        )}
      </div>
    </main>
  );
}
