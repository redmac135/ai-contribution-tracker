import React from "react";
import styles from "./StudentResponse.module.css";

interface ResponseProps {
  subtitle: string;
  textAnswer: string;
}

function StudentResponse({ subtitle, textAnswer }: ResponseProps) {
  return (
    <section className="flex flex-col">
      <p>{subtitle}</p>
      <p>{textAnswer}</p>
    </section>
  );
}

export default StudentResponse;
