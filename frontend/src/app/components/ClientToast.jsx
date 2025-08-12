"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientToast() {
  return <ToastContainer autoClose={3000} position="bottom-right" />;
}
