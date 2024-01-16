import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="text-center p-4 mt-4 mb-4">
      Made with <span className=" text-red-600">❤</span> by{" "}
      <Link
        href="https://niyonshuti.org"
        className="text-black font-semibold"
        target="blank"
      >
        Adelite Niyonshuti Shema
      </Link>
    </div>
  );
};

export default Footer;
