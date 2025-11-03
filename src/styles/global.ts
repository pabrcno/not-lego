import { createGlobalStyle } from "styled-components";
import Lobster from "../../assets/fonts/Lobster-Regular.ttf";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Lobster';
    src: url(${Lobster}) format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: auto; 
  }
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: 'Lobster', cursive;

    /* Gradient base colors */
    background: linear-gradient(
    120deg,
    #ffd6d6,
    #ffe8c8,
    #e1ffd6,
    #d6f7ff,
    #e5d6ff
  );
    background-size: 400% 400%;
    animation: waveGradient 12s ease-in-out infinite;
  }


  @keyframes waveGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

export default GlobalStyle;
