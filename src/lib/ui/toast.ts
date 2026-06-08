import Swal, { type SweetAlertIcon } from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export function showToast(icon: SweetAlertIcon, title: string) {
  void Toast.fire({
    icon,
    title,
  });
}

export function showSuccessToast(title: string) {
  showToast("success", title);
}

export function showErrorToast(title: string) {
  showToast("error", title);
}

export function showWarningToast(title: string) {
  showToast("warning", title);
}
