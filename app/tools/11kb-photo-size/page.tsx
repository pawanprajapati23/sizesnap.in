import { permanentRedirect } from 'next/navigation';

export default function RedirectPage() {
  permanentRedirect('/tools/compress-image-to-11kb');
}
