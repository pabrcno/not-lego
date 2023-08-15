import { useEffect, useState } from "react";
import { Lego1x1, Lego2x2, Lego4x2 } from "../components/legos";
import React from "react";
import debounce from "lodash/debounce";
export const useLegos = () => {
  const colors = [
    "#B40000",
    "#FCAC00",
    "#00852B",
    "#1E5AA8",
    "#069D9F",
    "#D05098",
  ];
  const meshes = [Lego1x1, Lego2x2, Lego4x2];

  const [legos, setLegos] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const handleKeyDown = debounce((e: KeyboardEvent) => {
      switch (e.code) {
        case "Digit1":
          setLegos([
            ...legos,
            React.createElement(meshes[0], {
              key: legos.length,
              // scale: [0.5, 0.5, 0.5],
              position: [0, 10, 0],

              color: colors[Math.floor(Math.random() * colors.length)],
            }),
          ]);
          break;
        case "Digit2":
          setLegos([
            ...legos,
            React.createElement(meshes[1], {
              key: legos.length,
              // scale: [0.5, 0.5, 0.5],
              color: colors[Math.floor(Math.random() * colors.length)],
            }),
          ]);
          break;
        case "Digit3":
          setLegos([
            ...legos,
            React.createElement(meshes[2], {
              key: legos.length,
              // scale: [0.5, 0.5, 0.5],

              color: colors[Math.floor(Math.random() * colors.length)],
            }),
          ]);
          break;

        default:
          break;
      }
    }, 200);

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legos]);

  return { legos, setLegos };
};
