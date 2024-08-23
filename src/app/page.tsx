import Link from "next/link";
import Image from "next/image";

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

export default function HomePage() {
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {[...mockImages, ...mockImages, ...mockImages, ...mockImages, ...mockImages].map(
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
