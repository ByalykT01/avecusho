// Logo.js
import Image from "next/image";
import Link from "next/link";
import icon from "public/avecusho.png"

const Logo = () => (
  <Link href={"/"}>
  <div className="flex items-center">
    <Image
      src={icon}
      width={50}
      height={50}
      className="h-auto w-auto object-contain"
      alt="Avecusho"
    />
  </div>
  </Link>
);

export default Logo;
