/**
 * Safe JPEG padding utility using standard ITU-T T.81 / ISO 10918-1 COM (Comment) markers (0xFF 0xFE).
 * Allows inflating JPEG file size to meet strict minimum file size thresholds on government portals
 * (e.g. RRB Railway 30KB-70KB, SSC 20KB-50KB) without altering image pixels or resolution.
 */
export async function padJpegBlob(blob: Blob, targetBytes: number): Promise<Blob> {
  if (blob.size >= targetBytes) return blob;
  const diff = targetBytes - blob.size;
  if (diff < 4) return blob; // Too small for standard COM segment

  try {
    const buffer = await blob.arrayBuffer();
    const original = new Uint8Array(buffer);

    // Verify JPEG SOI (Start of Image) marker: 0xFF 0xD8
    if (original[0] !== 0xFF || original[1] !== 0xD8) {
      return blob;
    }

    let remaining = diff;
    const segments: Uint8Array[] = [];

    // JPEG COM segment maximum payload is 65533 bytes (since length is 16-bit unsigned short)
    while (remaining >= 4) {
      const segPayload = Math.min(remaining - 4, 65530);
      const segLength = segPayload + 2;
      const seg = new Uint8Array(4 + segPayload);
      seg[0] = 0xFF;
      seg[1] = 0xFE;
      seg[2] = (segLength >> 8) & 0xFF;
      seg[3] = segLength & 0xFF;

      // Fill with safe ASCII space characters (0x20)
      for (let i = 0; i < segPayload; i++) {
        seg[4 + i] = 0x20;
      }

      segments.push(seg);
      remaining -= seg.length;
    }

    const totalExtra = segments.reduce((sum, s) => sum + s.length, 0);
    const newBytes = new Uint8Array(original.length + totalExtra);

    // Keep SOI marker (0xFF 0xD8)
    newBytes.set(original.subarray(0, 2), 0);

    // Insert safe COM segments right after SOI
    let offset = 2;
    for (const seg of segments) {
      newBytes.set(seg, offset);
      offset += seg.length;
    }

    // Append remaining JPEG payload
    newBytes.set(original.subarray(2), offset);

    return new Blob([newBytes], { type: 'image/jpeg' });
  } catch (err) {
    console.error('Failed to pad JPEG blob:', err);
    return blob;
  }
}
