import Image from "next/image";
import icon from "public/avecusho.png"

const Logo = () => (
  <div className="flex items-center">
    <Image
      src={icon}
      width={50}
      height={50}
      className="h-auto w-auto object-contain"
      alt="Avecusho"
    />
  </div>
);

export default Logo;
