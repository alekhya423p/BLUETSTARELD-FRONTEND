import { toast } from "react-toastify";

const toastSuccess = (message = "Something went wrong") => {
  toast.success(message);
};

const toastError = (message = "Something went wrong") => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
export default {
  toastSuccess,
  toastError,
};
