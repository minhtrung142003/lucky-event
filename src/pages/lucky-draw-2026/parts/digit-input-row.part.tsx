import React from 'react';
import { DigitPosition, DIGIT_CONSTRAINTS, LOTTERY_CODE_LENGTH } from '../types';
import circle from '../../../assets/images/circle.svg';
import logoOnly from '../../../assets/images/Logo-only.svg';

interface DigitInputRowPartProps {
  digits: (number | null)[];
  nextPosition: DigitPosition | null;
  onDigitEnter: (position: DigitPosition, value: number) => void;
  onUndo?: () => void;
  disabled?: boolean;
  allDigitsAligning?: boolean;
  digitRevealed?: boolean[];
}

export const DigitInputRowPart: React.FC<DigitInputRowPartProps> = ({
  digits,
  nextPosition,
  onDigitEnter,
  onUndo,
  disabled = false,
  allDigitsAligning = false,
  digitRevealed = [true, true, true],
}) => {
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    if (disabled || nextPosition === null) return;
    const target = inputRefs.current[nextPosition];
    if (target) {
      target.focus();
      target.select();
    }
  }, [disabled, nextPosition]);

  const handleChange = (position: DigitPosition, value: string) => {
    if (disabled || nextPosition !== position) return;
    const lastChar = value.slice(-1);
    const digit = Number(lastChar);
    if (!Number.isInteger(digit)) return;
    if (!DIGIT_CONSTRAINTS[position]?.includes(digit)) return;
    onDigitEnter(position, digit);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, position: DigitPosition) => {
    if (event.key === 'Backspace' && onUndo) {
      event.preventDefault();
      const currentValue = digits[position];
      if (currentValue === null) {
        onUndo();
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '80px', width: '100%', justifyContent: 'center' }}>
      {digits.slice(0, LOTTERY_CODE_LENGTH).map((digit, index) => {
        const position = index as DigitPosition;
        // All positions are now inputtable (no locked position)
        const isActive = nextPosition === position && !disabled;
        const isReadOnly = disabled || !isActive;

        // Calculate scale for cascade alignment animation
        // When allDigitsAligning: all digits should scale to same size (1.15x)
        let targetScale = 1;
        if (allDigitsAligning) {
          // All digits align to same size with cascade timing
          targetScale = 1.15;
        }

        // Cascade delay for alignment animation
        const cascadeDelay = allDigitsAligning ? `${(LOTTERY_CODE_LENGTH - 1 - index) * 150}ms` : '0ms';

        // Ô số chỉ được mở khi đã reveal VÀ có số (digitRevealed[index] phải là true)
        const isDigitRevealed = digitRevealed[index];

        return (
          <div
            key={index}
            style={{
              position: 'relative',
              width: 280,
              height: 280,
              transform: `scale(${targetScale})`,
              transition: `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${cascadeDelay}`,
            }}
          >
            {/* Cái răng cưa bên ngoài */}
            <img
              src={circle}
              alt=""
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                zIndex: 3,
                animation: `digitRingSpin ${5}s linear infinite`,
              }}
            />

            {/* Vòng tròn gradient border BÊN TRONG răng cưa */}
            <div
              style={{
                position: 'absolute',
                inset: '20px',
                borderRadius: '50%',
                background: 'linear-gradient(137deg, #CBF3F0 16%, #FCFFFE 46.45%, #CBF3F0 80%)',
                zIndex: 1,
                border: '8px solid #81D4CA',
              }}
            />
            <input
              aria-label={`Digit ${index + 1}`}
              value={digit ?? ''}
              ref={(el: HTMLInputElement | null) => {
                inputRefs.current[index] = el;
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(position, event.target.value)}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(event, position)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              readOnly={isReadOnly}
              tabIndex={isReadOnly ? -1 : 0}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                textAlign: 'center',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: 160,
                color: '#026d60',
                caretColor: isActive ? '#026d60' : 'transparent',
                cursor: isActive ? 'text' : 'default',
                WebkitTextFillColor: '#026d60',
                opacity: 1,
                zIndex: 4,
              }}
            />

            {/* Logo Cover - luôn che ô số, chỉ mở khi đã reveal */}
            <div
              style={{
                position: 'absolute',
                inset: '20px',
                borderRadius: '50%',
                background: 'linear-gradient(137deg, #CBF3F0 16%, #FCFFFE 46.45%, #CBF3F0 80%)',
                zIndex: isDigitRevealed ? 2 : 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                transform: isDigitRevealed ? 'rotateX(90deg) translateY(-50%)' : 'rotateX(0deg) translateY(0)',
                transformOrigin: 'center top',
                opacity: isDigitRevealed ? 0 : 1,
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-out',
                border: '8px solid #81D4CA',
              }}
            >
              <img
                src={logoOnly}
                alt="Logo cover"
                style={{
                  width: '72%',
                  height: '72%',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes digitRingSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
