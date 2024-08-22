import Link from "next/link";
import Image from "next/image";

const mockUrls = [
  // "https://utfs.io/f/86c1ee30-c8e6-4b94-922b-bd05dcf96ee3-zczyo4.jpg",
  // "https://utfs.io/f/dfddd8f0-774e-43c7-9044-d940081a6749-zd0lk7.jpg",
  // "https://utfs.io/f/241d93be-c8db-4aa8-8197-e200c371185c-zd0lmo.jpg",
  // "https://utfs.io/f/f4ba926b-70e9-4a65-8d20-2fe42f04537e-zczyp1.jpg",
  // "https://utfs.io/f/d13a371e-a85c-4660-b8a5-7a1c3205c537-zczyov.jpg",
  // "https://utfs.io/f/975decaf-b748-4f13-b3bc-ca937ba284d0-zczynd.jpg",
  "https://static.wikia.nocookie.net/silly-cat/images/3/33/Noopy.png/revision/latest?cb=20231201205915",
  "https://static.wikia.nocookie.net/silly-cat/images/b/b8/War_of_the_Silly_and_Unsilly.jpg/revision/latest?cb=20240310230516",
  "https://static.wikia.nocookie.net/silly-cat/images/f/f7/Apple_Cat.jpg/revision/latest?cb=20240116165838&format=original",
  "https://static.wikia.nocookie.net/silly-cat/images/3/35/Cuh.png/revision/latest?cb=20231019143206&format=original",
  "https://static.wikia.nocookie.net/silly-cat/images/e/e5/Dear_god_its_him.png/revision/latest?cb=20240311020147&format=original",
];

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

export default function HomePage() {
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {[...mockImages, ...mockImages, ...mockImages, ...mockImages].map(
          (image) => (
            <div key={image.id} className="w-48">
              <Image src={image.url} width={500} height={500} alt="image" />
            </div>
          ),
        )}
      </div>
    </main>
  );
}
