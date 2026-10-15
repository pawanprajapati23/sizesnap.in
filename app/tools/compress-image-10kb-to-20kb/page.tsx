import { permanentRedirect } from "next/navigation";

export default function RedirectPage() {
  permanentRedirect("/tools/compress-image-between-10kb-to-20kb");
}
