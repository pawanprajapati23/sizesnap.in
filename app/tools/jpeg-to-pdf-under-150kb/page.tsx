import { permanentRedirect } from "next/navigation";

export default function RedirectPage() {
  permanentRedirect("/tools/jpg-to-pdf-under-150kb");
}
