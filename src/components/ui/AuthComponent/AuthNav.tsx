import { usePathname } from "next/navigation";
import { useState } from "react";

const AuthNav = () => {
  const pathname = usePathname();
  const navs = [
    { text: "Sign Up", href: "/auth/register" },
    { text: "Sign in", href: "/auth/login" },
  ];
  return (
    <div className="flex items-center w-full shadow-2xl gap-0 font-satoshi">
      {navs.map((nav) => (
        <a
          className={`cursor-pointer ${pathname === nav.href
            ? "bg-linear-to-r from-[#575EFF] to-[#282D99]  p-px"
            : ""
            }  text-transparent block flex-1 rounded-md  overflow-hidden `}
          // onClick={() => {
          //   setActive(nav.href);
          // }}
          href={nav.href}
        >
          <span
            className={`w-full h-full bg p-[9px]  block text-center rounded   ${pathname === nav.href
              ? "text-sm bg-cloudWhite text-primary"
              : "font-medium text-base text-gray bg-white"
              } `}
          >
            {nav.text}
          </span>
        </a>
      ))}
    </div>
  );
};

export default AuthNav;
