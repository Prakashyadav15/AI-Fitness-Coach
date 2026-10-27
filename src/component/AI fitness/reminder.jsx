import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useEffect } from "react";

function Notifications() {
  useEffect(() => {
    const fetchNotification = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      const res = await fetch("http://localhost:3000/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.length > 0) {
        const latest = data[0];

        // ✅ Show toast only once
        toast.info(`🔔 ${latest.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // ✅ Mark notification as read so it won't appear again
        await fetch("http://localhost:3000/notifications/read", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    };

    fetchNotification();
  }, []); // runs only once when app opens

  return <ToastContainer />;
}

export default Notifications;
