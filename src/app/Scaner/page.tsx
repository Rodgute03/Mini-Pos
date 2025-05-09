"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import { CiMenuKebab } from "react-icons/ci";

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.CODE_128,
      BarcodeFormat.UPC_A,
    ]);

    const codeReader = new BrowserMultiFormatReader(hints);

    const constraints = {
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };

    codeReader.decodeFromConstraints(
      constraints,
      videoRef.current!,
      (res, err) => {
        if (res) {
          setResult(res.getText());
          (codeReader as any).reset(); // Detener escaneo después de leer
        }
      }
    );

    return () => {
      (codeReader as any).reset(); // Limpiar cámara al desmontar
    };
  }, []);

  return (
    <div className="flex flex-col items-center h-[100vh] gap-5 p-5">
      <video
        ref={videoRef}
        className="w-full rounded"
      />
      <div className="border-white border-1 w-full h-full rounded"></div>
      <div className="h-[10vh] w-full flex gap-5">
        <button className="rounded w-full h-full border-white border-1 text-white active:bg-white active:text-[#111]">Comprar</button>
        <button className="rounded w-[60px] h-full border-white border-1 text-white flex justify-center items-center text-2xl active:bg-white active:text-[#111]">
          <CiMenuKebab />
        </button>
      </div>
    </div>
  );
}
