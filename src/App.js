import React, { useState } from 'react';
import { Dices, Trash2, Plus, RotateCw, Sparkles } from 'lucide-react';
import './App.css';

const DiceRoller = () => {
  const [selectedDice, setSelectedDice] = useState([]);
  const [rolling, setRolling] = useState(false);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [modifier, setModifier] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [particles, setParticles] = useState([]);
  const [overlayFading, setOverlayFading] = useState(false);

  const diceTypes = [
    { name: 'D4', sides: 4, icon: '▲' },
    { name: 'D6', sides: 6, icon: '⬟' },
    { name: 'D8', sides: 8, icon: '◆' },
    { name: 'D10', sides: 10, icon: '◇' },
    { name: 'D12', sides: 12, icon: '⬢' },
    { name: 'D20', sides: 20, icon: '⬣' },
    { name: 'D100', sides: 100, icon: '%' }
  ];

  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
    '#10b981', '#14b8a6', '#06b6d4', '#3b82f6',
    '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'
  ];

  const addDice = (diceType) => {
    const newDice = {
      id: Date.now() + Math.random(),
      type: diceType.name,
      sides: diceType.sides,
      icon: diceType.icon,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setSelectedDice([...selectedDice, newDice]);
  };

  const removeDice = (id) => {
    setSelectedDice(selectedDice.filter(d => d.id !== id));
  };

  const changeDiceColor = (id, color) => {
    setSelectedDice(selectedDice.map(d => 
      d.id === id ? { ...d, color } : d
    ));
  };

  const createParticles = () => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 0.5
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  const rollDice = () => {
    if (selectedDice.length === 0) return;
    
    setRolling(true);
    setShowResults(false);
    setResults([]);
    setOverlayFading(false);
    createParticles();

    const newResults = selectedDice.map(dice => ({
      ...dice,
      result: Math.floor(Math.random() * dice.sides) + 1,
      rotation: {
        x: Math.random() * 360,
        y: Math.random() * 360,
        z: Math.random() * 360
      }
    }));

    setTimeout(() => {
      setResults(newResults);
    }, 2000);

    setTimeout(() => {
      setOverlayFading(true);
    }, 3500);

    setTimeout(() => {
      setShowResults(true);
      const total = newResults.reduce((sum, r) => sum + r.result, 0) + modifier;
      setHistory([{ dice: newResults, total, modifier, timestamp: new Date() }, ...history.slice(0, 4)]);
      setRolling(false);
    }, 4200);
  };

  const clearAll = () => {
    setSelectedDice([]);
    setResults([]);
    setModifier(0);
    setShowResults(false);
  };

  const total = results.reduce((sum, r) => sum + r.result, 0) + modifier;

  return (
    <div className="app-container">
      <div className="background-overlay">
        <div className="bg-bubble bg-bubble-1"></div>
        <div className="bg-bubble bg-bubble-2"></div>
      </div>

      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      <div className="content-wrapper">
        <div className="header">
          <div className="header-content">
            <Sparkles className="header-icon" />
            <h1 className="header-title">Lanceur de Dés RPG</h1>
            <Sparkles className="header-icon" />
          </div>
          <p className="header-subtitle">Choisissez vos dés, personnalisez et lancez !</p>
        </div>

        <div className="dice-selection-panel">
          <h2 className="panel-title">
            <Plus className="icon-small" />
            Sélectionner des dés
          </h2>
          <div className="dice-grid">
            {diceTypes.map(dice => (
              <button
                key={dice.name}
                onClick={() => addDice(dice)}
                className="dice-button"
              >
                <div className="dice-icon">{dice.icon}</div>
                <div className="dice-name">{dice.name}</div>
              </button>
            ))}
          </div>
        </div>

        {rolling && (
          <div className={`overlay ${overlayFading ? 'overlay-fading' : ''}`}>
            <div className="overlay-content">
              <div className="overlay-background"></div>
              
              <div className="dice-display-grid">
                {results.length === 0 ? (
                  selectedDice.map((dice, index) => (
                    <div
                      key={dice.id}
                      className="dice-rolling-container"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div 
                        className="dice-3d"
                        style={{ 
                          color: dice.color,
                          filter: `drop-shadow(0 0 20px ${dice.color})`
                        }}
                      >
                        <div className="dice-icon-large spinning">
                          {dice.icon}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  results.map((result, index) => (
                    <div
                      key={result.id}
                      className="result-card-overlay landing"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div 
                        className="result-card-content"
                        style={{ 
                          borderColor: result.color,
                          boxShadow: `0 0 40px ${result.color}60`
                        }}
                      >
                        <div style={{ color: result.color }} className="result-icon-large">
                          {result.icon}
                        </div>
                        <div className="result-type">{result.type}</div>
                        <div className="result-value pulsing" style={{ color: result.color }}>
                          {result.result}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="overlay-text">
                {results.length === 0 ? (
                  <div className="rolling-text">
                    🎲 LANCER EN COURS... 🎲
                  </div>
                ) : (
                  <div className="result-text">
                    <div className="result-title">
                      ⭐ RÉSULTAT ⭐
                    </div>
                    <div className="result-total-large">
                      Total: {results.reduce((sum, r) => sum + r.result, 0) + modifier}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedDice.length > 0 && !rolling && (
          <div className="selected-dice-panel">
            <div className="panel-header">
              <h2 className="panel-title-small">Dés sélectionnés ({selectedDice.length})</h2>
              <button onClick={clearAll} className="clear-button">
                <Trash2 className="icon-small" />
                Tout effacer
              </button>
            </div>
            <div className="selected-dice-grid">
              {selectedDice.map(dice => (
                <div key={dice.id} className="selected-dice-card">
                  <div className="card-header">
                    <div style={{ color: dice.color }} className="card-dice-icon">
                      {dice.icon}
                    </div>
                    <button onClick={() => removeDice(dice.id)} className="remove-button">
                      <Trash2 className="icon-tiny" />
                    </button>
                  </div>
                  <div className="card-dice-type">{dice.type}</div>
                  <div className="color-palette">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => changeDiceColor(dice.id, color)}
                        className={`color-button ${dice.color === color ? 'color-button-active' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="modifier-section">
              <label className="modifier-label">Modificateur:</label>
              <button
                onClick={() => setModifier(Math.max(modifier - 1, -99))}
                className="modifier-button modifier-minus"
              >
                -
              </button>
              <input
                type="number"
                value={modifier}
                onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                className="modifier-input"
              />
              <button
                onClick={() => setModifier(Math.min(modifier + 1, 99))}
                className="modifier-button modifier-plus"
              >
                +
              </button>
            </div>

            <button onClick={rollDice} disabled={rolling} className="roll-button">
              <div className="roll-button-shine"></div>
              <RotateCw className="roll-icon" />
              <span className="roll-text">LANCER LES DÉS !</span>
              <Sparkles className="roll-icon" />
            </button>
          </div>
        )}

        {results.length > 0 && showResults && (
          <div className="results-panel">
            <h2 className="results-title">
              <Sparkles className="icon-small sparkle" />
              Résultats
            </h2>
            <div className="results-grid">
              {results.map((result, index) => (
                <div 
                  key={result.id} 
                  className="result-card"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    boxShadow: `0 0 30px ${result.color}40`
                  }}
                >
                  <div style={{ color: result.color }} className="result-icon">
                    {result.icon}
                  </div>
                  <div className="result-type-small">{result.type}</div>
                  <div className="result-number pulsing" style={{ color: result.color }}>
                    {result.result}
                  </div>
                </div>
              ))}
            </div>
            <div className="total-card">
              <div className="total-shine"></div>
              <div className="total-label">⭐ TOTAL ⭐</div>
              <div className="total-value">{total}</div>
              {modifier !== 0 && (
                <div className="total-breakdown">
                  (Dés: {total - modifier} {modifier > 0 ? '+' : ''}{modifier})
                </div>
              )}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-panel">
            <h2 className="panel-title-small">📜 Historique</h2>
            <div className="history-list">
              {history.map((entry, index) => (
                <div key={index} className="history-item">
                  <div className="history-content">
                    <div className="history-dice">
                      {entry.dice.map((d, i) => (
                        <span key={i} style={{ color: d.color }} className="history-die">
                          {d.type}:{d.result}
                        </span>
                      ))}
                      {entry.modifier !== 0 && (
                        <span className="history-modifier">
                          ({entry.modifier > 0 ? '+' : ''}{entry.modifier})
                        </span>
                      )}
                    </div>
                    <div className="history-total">
                      = {entry.total}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiceRoller;
