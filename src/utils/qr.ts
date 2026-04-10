import QRCode from 'qrcode';

/**
 * Generates a QR code and renders it to a canvas element.
 * @param text The text to encode in the QR code.
 * @param canvas The canvas element to render to.
 */
export async function generateQRCode(text: string, canvas: HTMLCanvasElement) {
  try {
    await QRCode.toCanvas(canvas, text, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
  }
}
