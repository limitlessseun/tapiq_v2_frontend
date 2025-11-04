"use client";

import ModalBackdrop from "@/components/ui/modalBackdrop";
import React, { useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";

interface IAnimatedModalLayout {
  children: React.ReactNode;
  className?: string;
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>;
  showCloseIcon?: boolean;
  maxWidth?: number;
}
export default function AnimatedModalLayout({
  children,
  className = "",
  setShowModal,
  maxWidth = 500,
  showCloseIcon = false,
}: IAnimatedModalLayout) {
  const modalBackgroundRef = useRef<HTMLDivElement | null>(null);

  const backDropCloseHandler = (e: any) => {
    if (!modalBackgroundRef.current?.contains(e.target)) {
      if (setShowModal) {
        setShowModal(false);
      }
    }
  };

  return (
    <ModalBackdrop
      onClose={backDropCloseHandler}
      className="bg-gradient-to-b from-[rgba(5,126,183,0.8)] from-[2.1%]
        via-[rgba(20,25,134,0.8)] via-[50.13%] to-[rgba(14,18,100,0.8)]
        to-[98.16%] grid place-items-center p-4 modal-bg-inner-opacity-animation
        overflow-hidden "
    >
      <div
        style={{ maxWidth }}
        ref={modalBackgroundRef}
        className={`bg-white rounded-2xl w-full modal-inner-move-up-animation ${className}`}
      >
        {showCloseIcon && (
          <span
            className="absolute top-4 right-6 md:top-6 md:right-4 cursor-pointer"
            onClick={() => {
              if (setShowModal) {
                setShowModal(false);
              }
            }}
          >
            <IoCloseOutline size={28} className="text-dark" />
          </span>
        )}
        {children}
      </div>
    </ModalBackdrop>
  );
}
