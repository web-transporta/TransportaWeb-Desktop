import React from 'react';
import '/css/paginaHome.css';

const App = () => {
    return (
        <div>
            <header>
                <div className="header-container">
                    <div className="logo">
                        <img src="./img/logo com fundo branco.PNG" alt="Logo" height="80" />
                    </div>
                    <div className="button-group">
                        <a href="*historico*" className="button historico">Histórico</a>
                        <a href="*viagens*" className="button viagens">Viagens</a>
                        <a href="*motoristas*" className="button motoristas">Motoristas</a>
                        <a href="/**/" className="button test"><p>PERFIL</p></a>
                    </div>
                </div>
            </header>

            <div>
                <div className="header">Olá, "nome".</div>
                <div className="container">
                    <p className="info">Motoristas trabalhando: <span id="motoristas"></span></p>
                    <p className="info">Viagens ativas: <span id="viagensAtivas"></span></p>
                    <p className="info">Viagens concluídas: <span id="viagensConcluidas"></span></p>
                    <p className="info">Renda diária: <span id="rendaDiaria"></span></p>
                </div>
                <div className="weather">
                    <img src="https://openweathermap.org/img/wn/01d.png" alt="sol" id="weatherIcon" />
                    <span id="temperature">32 °C</span>
                </div>
            </div>

            <footer className="footer">
                <div className="logobaixa">
                    <img src="./img/logo com fundo branco.PNG" alt="logo da empresa" height="80" />
                </div>
                <div className="footer-container">
                    <span className="text-muted">
                        WEBTRANSPORTA@WEBTRANSPORTA.COM<br />
                        11 91234-5678<br />
                        @WEBTRANSPORTA
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default App;