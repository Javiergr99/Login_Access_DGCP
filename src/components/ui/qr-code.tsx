import { QRCodeSVG } from "qrcode.react";

export function QrCode({ value, size = 184 }: { value: string; size?: number }) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      level="M"
      role="img"
      aria-label="Código QR para configurar la autenticación de dos factores"
      className="h-auto max-w-full rounded-lg bg-white"
      bgColor="#FFFFFF"
      fgColor="#111827"
    />
  );
}
