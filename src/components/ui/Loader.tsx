import React from "react";

export default function Loader() {
  return (
    <div>
      <img
        src="/assets/loadericon.svg"
        alt=""
        className="w-20 h-20 animate-spin-infinit"
      />
    </div>
  );
}
