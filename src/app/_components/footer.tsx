"use client";
import Link from "next/link";
import Image from "next/image";
import { FaTelegramPlane } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { MdOutlineAttachEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-500 bg-zinc-100 pb-10 pt-3">
      <nav>
        <div className="mx-auto flex max-w-screen-xl justify-center py-3">
          <Link href="https://t.me/avecushoz">
            <FaTelegramPlane className="mx-3 h-7 w-7" />
          </Link>
          <Link href="https://www.instagram.com/avecusho/">
            <FaInstagram className="mx-3 h-7 w-7" />
          </Link>
          <Link href="mailto:hohliykaurora2008@gmail.com">
            <MdOutlineAttachEmail className="mx-3 h-7 w-7" />
          </Link>
        </div>
      </nav>
    </footer>
  );
}
