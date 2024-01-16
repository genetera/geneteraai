import toast from "react-hot-toast";

export const toastify = (message: {
  icon: "success" | "error";
  title: string;
}) => {
  toast[message.icon](message.title, {
    duration: 6000,
    position: "top-right",
    className: "font-bold",
  });
};
