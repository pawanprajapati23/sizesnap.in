import { permanentRedirect } from "next/navigation";

export default function RedirectPage() {
  permanentRedirect("/tools/compress-image-between-20kb-to-50kb");
}
