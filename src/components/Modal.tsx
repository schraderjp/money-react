import React, { ReactNode, useEffect } from "react";
import { Portal } from "react-portal";
import { FaTimes } from "react-icons/fa";

type ModalProps = {
  onClose: () => void;
  open: boolean;
  content: ReactNode;
  title: string;
};

const Modal = ({ onClose, open, content, title }: ModalProps) => {
  const onEsc = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onEsc);

    return () => document.removeEventListener("keydown", onEsc);
  });
  return (
    <Portal>
      {open && (
        <div
          onClick={onClose}
          className="fixed top-0 z-0 flex h-screen w-screen justify-center bg-black bg-opacity-30 pt-[15vh]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-max max-h-[70vh] min-h-[5rem] min-w-[10rem] rounded bg-white p-2 shadow-lg"
          >
            <div className="flex gap-2">
              <h2 className="w-full select-none text-center text-xl font-bold text-sky-800">
                {title}
              </h2>
              <button
                className=" text-sky-900 transition-transform active:scale-90"
                onClick={onClose}
              >
                <FaTimes size={26} />
              </button>
            </div>

            <div className="p-2">{content}</div>
          </div>
        </div>
      )}
    </Portal>
  );
};

export default Modal;
