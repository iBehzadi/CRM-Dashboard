import toast from "react-hot-toast";
const notify = (type, message) => {
  toast[type](message, {
    position: "bottom-center",
    duration: 4000,
  });
};
export default notify;
