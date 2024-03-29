import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ButtonPrimary from "./buttons/button";
import ButtonSecondary from "./buttons/button-secondary";

interface IProps {
  children: any;
  title: string;
  description?: string;
  warning?: boolean;
  isOpen: boolean;
  handleClose: () => void;
}

const Modal = (props: IProps) => {
  return (
    <Transition.Root show={props.isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-20" onClose={props.handleClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-brand-backdrop bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg border border-brand-base bg-white text-left shadow-xl transition-all sm:my-8 sm:w-[40rem]">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    {props.warning ? (
                      <div className="mx-auto ml-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/20 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="mt-3 text-center sm:mt-0  sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg text-xl font-bold leading-6 text-brand-base"
                      >
                        {props.title}
                        <div className="absolute right-2 top-2 p-2">
                          <button type="button" onClick={props.handleClose}>
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </Dialog.Title>

                      <div className="mt-2">
                        <p className="text-md text-brand-secondary ">
                          {props.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {props.children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
