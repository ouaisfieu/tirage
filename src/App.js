import React, { useState } from 'react';
import { Dices, Trash2, Plus, RotateCw, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Particles during roll */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${particle.duration}s ease-out forwards`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-10 h-10 text-yellow-400 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 animate-gradient">
              Lanceur de Dés RPG
            </h1>
            <Sparkles className="w-10 h-10 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-purple-300 text-lg">Choisissez vos dés, personnalisez et lancez !</p>
        </div>

        {/* Dice Selection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl hover:shadow-purple-500/50 transition-all">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Sélectionner des dés
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
            {diceTypes.map(dice => (
              <button
                key={dice.name}
                onClick={() => addDice(dice)}
                className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl p-4 transition-all transform hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-purple-500/50 active:scale-95"
              >
                <div className="text-3xl mb-1">{dice.icon}</div>
                <div className="text-sm font-bold">{dice.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Rolling Animation Area */}
        {rolling && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-700 ${overlayFading ? 'opacity-0' : 'opacity-100'}`}>
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50"></div>
              
              {/* Rolling or Results in overlay */}
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl">
                {results.length === 0 ? (
                  // Rolling Dice
                  selectedDice.map((dice, index) => (
                    <div
                      key={dice.id}
                      className="dice-rolling perspective-1000"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div 
                        className="dice-3d"
                        style={{ 
                          color: dice.color,
                          filter: 'drop-shadow(0 0 20px currentColor)'
                        }}
                      >
                        <div className="text-6xl md:text-8xl font-bold animate-spin-3d">
                          {dice.icon}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Results in overlay
                  results.map((result, index) => (
                    <div
                      key={result.id}
                      className="perspective-1000 animate-dice-land"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div 
                        className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center border-2"
                        style={{ 
                          borderColor: result.color,
                          boxShadow: `0 0 40px ${result.color}60`
                        }}
                      >
                        <div style={{ color: result.color }} className="text-6xl md:text-8xl mb-2 drop-shadow-glow">
                          {result.icon}
                        </div>
                        <div className="text-white font-bold mb-2 text-xl">{result.type}</div>
                        <div className="text-6xl md:text-8xl font-bold animate-pulse-scale" style={{ color: result.color }}>
                          {result.result}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Rolling or Result text */}
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full text-center px-4">
                {results.length === 0 ? (
                  <div className="text-4xl md:text-6xl font-bold text-white animate-bounce">
                    🎲 LANCER EN COURS... 🎲
                  </div>
                ) : (
                  <div className="animate-result-appear">
                    <div className="text-3xl md:text-5xl font-bold text-yellow-300 mb-4">
                      ⭐ RÉSULTAT ⭐
                    </div>
                    <div className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300">
                      Total: {results.reduce((sum, r) => sum + r.result, 0) + modifier}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Selected Dice */}
        {selectedDice.length > 0 && !rolling && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Dés sélectionnés ({selectedDice.length})</h2>
              <button
                onClick={clearAll}
                className="text-red-400 hover:text-red-300 transition-all flex items-center gap-2 hover:scale-110"
              >
                <Trash2 className="w-5 h-5" />
                Tout effacer
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {selectedDice.map(dice => (
                <div key={dice.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
                  <div className="flex justify-between items-start mb-3">
                    <div style={{ color: dice.color }} className="text-3xl font-bold drop-shadow-lg">
                      {dice.icon}
                    </div>
                    <button
                      onClick={() => removeDice(dice.id)}
                      className="text-red-400 hover:text-red-300 transition-all hover:scale-110"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-white font-bold mb-2">{dice.type}</div>
                  <div className="flex gap-1 flex-wrap">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => changeDiceColor(dice.id, color)}
                        className={`w-6 h-6 rounded-full transition-all hover:scale-125 ${
                          dice.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Modifier */}
            <div className="flex items-center gap-4 mb-4">
              <label className="text-white font-semibold">Modificateur:</label>
              <button
                onClick={() => setModifier(Math.max(modifier - 1, -99))}
                className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-lg font-bold transition-all hover:scale-110 active:scale-95"
              >
                -
              </button>
              <input
                type="number"
                value={modifier}
                onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                className="w-20 bg-white/10 text-white text-center rounded-lg p-2 border border-white/20 font-bold text-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
              <button
                onClick={() => setModifier(Math.min(modifier + 1, 99))}
                className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-lg font-bold transition-all hover:scale-110 active:scale-95"
              >
                +
              </button>
            </div>

            {/* Roll Button */}
            <button
              onClick={rollDice}
              disabled={rolling}
              className="w-full py-6 rounded-xl font-bold text-2xl transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <RotateCw className="w-8 h-8 relative z-10" />
              <span className="relative z-10">LANCER LES DÉS !</span>
              <Sparkles className="w-8 h-8 relative z-10" />
            </button>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && showResults && (
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 mb-6 border-2 border-green-400/50 shadow-2xl animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Résultats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {results.map((result, index) => (
                <div 
                  key={result.id} 
                  className="bg-white/10 rounded-xl p-6 text-center border border-white/20 hover:scale-110 transition-all animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    boxShadow: `0 0 30px ${result.color}40`
                  }}
                >
                  <div style={{ color: result.color }} className="text-4xl mb-2 drop-shadow-glow">
                    {result.icon}
                  </div>
                  <div className="text-white font-bold mb-1">{result.type}</div>
                  <div className="text-5xl font-bold text-white animate-pulse-scale" style={{ color: result.color }}>
                    {result.result}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-8 text-center border-2 border-yellow-400/50 relative overflow-hidden animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent animate-shimmer"></div>
              <div className="text-yellow-300 font-semibold mb-2 text-xl relative z-10">⭐ TOTAL ⭐</div>
              <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 animate-gradient relative z-10">
                {total}
              </div>
              {modifier !== 0 && (
                <div className="text-purple-300 mt-2 text-lg relative z-10">
                  (Dés: {total - modifier} {modifier > 0 ? '+' : ''}{modifier})
                </div>
              )}
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4">📜 Historique</h2>
            <div className="space-y-3">
              {history.map((entry, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex gap-2 flex-wrap">
                      {entry.dice.map((d, i) => (
                        <span key={i} style={{ color: d.color }} className="font-bold">
                          {d.type}:{d.result}
                        </span>
                      ))}
                      {entry.modifier !== 0 && (
                        <span className="text-purple-300">
                          ({entry.modifier > 0 ? '+' : ''}{entry.modifier})
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      = {entry.total}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0% { 
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% { 
            transform: translateY(-100vh) scale(0);
            opacity: 0;
          }
        }

        @keyframes spin-3d {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(720deg) rotateY(720deg) rotateZ(360deg);
          }
        }

        @keyframes dice-land {
          0% {
            transform: translateY(-100px) rotateZ(-180deg) scale(0);
            opacity: 0;
          }
          50% {
            transform: translateY(10px) rotateZ(-90deg) scale(1.1);
          }
          100% {
            transform: translateY(0) rotateZ(0deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes slide-up {
          0% {
            transform: translateY(50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes result-appear {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-spin-3d {
          animation: spin-3d 1.5s infinite linear;
        }

        .animate-dice-land {
          animation: dice-land 0.8s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-result-appear {
          animation: result-appear 0.6s ease-out forwards;
        }

        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .dice-rolling {
          animation: dice-land 2s ease-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .dice-3d {
          transform-style: preserve-3d;
          transition: transform 0.1s;
        }

        .drop-shadow-glow {
          filter: drop-shadow(0 0 10px currentColor);
        }
      `}</style>
    </div>
  );
};

export default DiceRoller;
```

---

#### 📄 `.gitignore`
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
