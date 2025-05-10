"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import { CiMenuKebab } from "react-icons/ci";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState("");
  const [producto, setProducto] = useState<Producto[]>([{
    id: 1,
    nombre: 'Arroz Costeño 1kg',
    precio: 3.50,
    stock: 1
  }]);
  const [err, setErr] = useState(false);

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
        if (err) {

        }
      }
    ).catch(err => {
      if (err.message.includes("Requested device not found")) {
        // Aquí va tu lógica, por ejemplo:
        setErr(true)
      } else {
        console.error("Otro error:", err);
      }

    });

    return () => {
      (codeReader as any).reset(); // Limpiar cámara al desmontar
    };
  }, []);

  const aument = (id: number) => {
    setProducto((prev) =>
      prev.map((prod) =>
        prod.id === id ? { ...prod, stock: prod.stock + 1 } : prod
      )
    );
  };
  const demis = (id: number) => {
    setProducto((prev) =>
      prev.map((prod) =>
        prod.id === id && prod.stock > 1?{ ...prod, stock: prod.stock - 1} : prod
      )
    );
  };

  return (
    <div className="flex flex-col items-center h-[100vh] gap-5 p-5">
      {
        err ?
          <div className="w-full h-[50vh] border-white border-1 flex justify-center items-center">
            <span className="text-white">No se encontro un camara disponible</span>
          </div>
          :
          <video
            ref={videoRef}
            className="w-full rounded"
          />
      }

      <div className="border-white border-1 w-full h-full rounded p-3">
        {producto.map((p) => (
          <div key={p.id} className="w-full flex justify-between text-white border-white border-1 p-2 rounded">
            <span>{p.nombre}</span>
            <span>{p.precio}</span>
            <div className="flex gap-2">
              <button onClick={() => demis(p.id)} className="w-[20px] border-white border-1 rounded text-center active:bg-slate-400">{"<"}</button>
              <span className="w-[40px] border-white border-1 rounded text-center">{p.stock}</span>
              <button onClick={() => aument(p.id)} className="w-[20px] border-white border-1 rounded text-center active:bg-slate-400">{">"}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="h-[10vh] w-full flex gap-5">
        <button className="rounded w-full h-full border-white border-1 text-white active:bg-white active:text-[#111]">Comprar</button>
        <button className="rounded w-[60px] h-full border-white border-1 text-white flex justify-center items-center text-2xl active:bg-white active:text-[#111]">
          <CiMenuKebab />
        </button>
      </div>
    </div>
  );
}
