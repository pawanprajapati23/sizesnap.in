import { permanentRedirect } from 'next/navigation';

export default function RedirectPage() {
  permanentRedirect('/tools/reduce-image-size-in-kb');
}
