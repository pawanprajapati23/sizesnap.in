import { permanentRedirect } from "next/navigation";

export default function RedirectPage() {
  permanentRedirect("/tools/add-name-and-date-on-photo");
}
