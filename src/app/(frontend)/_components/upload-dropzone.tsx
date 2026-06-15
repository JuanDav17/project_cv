"use client";

import { useRef, useState } from "react";

import { MaterialIcon } from "./material-icon";

type UploadDropzoneProps = {
  maxSizeBytes: number;
};

export function UploadDropzone({ maxSizeBytes }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [message, setMessage] = useState("Formatos soportados: PDF. Tamaño máximo: 1 MB.");

  const processFile = (file: File | null) => {
    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setMessage("Solo se permiten archivos PDF.");
      setFileName(null);
      return;
    }

    if (file.size > maxSizeBytes) {
      setMessage("El archivo supera el máximo permitido de 1 MB.");
      setFileName(null);
      return;
    }

    setFileName(file.name);
    setMessage("Archivo válido listo para enviar.");
  };

  return (
    <div className="fp-stack-sm">
      <label className="fp-label-md fp-field__label">Documento del Certificado</label>
      <div
        className={[
          "fp-dropzone",
          isDragging ? "is-dragging" : "",
          fileName ? "has-file" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          processFile(event.dataTransfer.files.item(0));
        }}
      >
        <div className="fp-dropzone__icon">
          <MaterialIcon filled={Boolean(fileName)}>
            {fileName ? "task" : "upload_file"}
          </MaterialIcon>
        </div>

        <p className="fp-body-md" style={{ margin: 0, color: "var(--fp-on-surface)", fontWeight: 500 }}>
          {fileName ? (
            <>
              <span className="fp-link fp-link--strong">{fileName}</span> seleccionado.
            </>
          ) : (
            <>
              Arrastra y suelta tu archivo aquí, o{" "}
              <span className="fp-link fp-link--strong">explora</span>
            </>
          )}
        </p>
        <p className="fp-body-sm fp-muted" style={{ margin: "0.5rem 0 0" }}>
          {message}
        </p>

        <input
          ref={inputRef}
          accept=".pdf,application/pdf"
          className="fp-sr-only"
          type="file"
          onChange={(event) => processFile(event.target.files?.item(0) ?? null)}
        />
      </div>
    </div>
  );
}
