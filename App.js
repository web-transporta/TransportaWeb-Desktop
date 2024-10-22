//teste
import React from 'react';
import './App.css';

const App = () => {
  return (
    <div>
      <header>
        <div className="header-container">
          <div className="logo">
            <img src="./img/logo_sem_fundo.png" alt="Logo" height="80" />
            <h1></h1>
          </div>
          <div className="button-group">
            <button className="button transparent">Soluções</button>
            <button className="button transparent">Sobre Nós</button>
            <button className="button transparent">Contatos</button>
            <button className="button test">Faça um teste! </button>
            <button className="button client-area">Área do Cliente</button>
          </div>
        </div>
      </header>
      <section className="background-header" />
      <footer className="footer">
        <div className="footer-container">
          <span>
            WEBTRANSPORTA@WEBTRANSPORTA.COM 11 91234-5678 @WEBTRANSPORTA
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
