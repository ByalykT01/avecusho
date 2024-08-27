"use client";
import Link from "next/link";
import Image from "next/image";
import telegram from "../../../public/ui_elements/telegram.svg";
import instagram from "../../../public/ui_elements/instagram.svg";
import email from "../../../public/ui_elements/email.svg";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-500 bg-zinc-100 pb-10 pt-3">
      <nav>
        <div className="mx-auto flex max-w-screen-xl justify-center py-3">
          <Link href="https://t.me/avecushoz">
            <Image
              height={25}
              width={25}
              src={telegram}
              alt="telegram"
              className="mx-3 hover:cursor-pointer"
            />
          </Link>
          <Link href="https://www.instagram.com/avecusho/">
            <Image
              height={25}
              width={25}
              src={instagram}
              alt="insta"
              className="mx-3 hover:cursor-pointer"
            />
          </Link>
          <Link href="mailto:hohliykaurora2008@gmail.com">
          <Image
            height={25}
            width={25}
            src={email}
            alt="email"
            className="mx-3 hover:cursor-pointer"
          />
          </Link>
        </div>
      </nav>
    </footer>
  );
}
