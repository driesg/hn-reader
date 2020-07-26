import React from "react";
import "./ErrorMessage.css";

interface ErrorProps {
  message: string;
}
export function ErrorMessage({ message }: ErrorProps) {
  return (
    <div className="error-msg">
      <p>
        <strong>An error has occurred:</strong>
      </p>
      <p>{message}</p>
    </div>
  );
}
