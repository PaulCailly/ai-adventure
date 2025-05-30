import { Message } from "ai";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Sword, ShieldHalf } from "lucide-react";

// Component to display a dice with enhanced animation effects.
function DiceRoll({ value, sides = 20 }: { value: number; sides?: number }) {
  // Generate random values for the dice throw
  const randomX = useMemo(() => (Math.random() - 0.5) * 100, []);
  // Generate a random final X offset so that dice land at slightly different positions
  const randomFinalX = useMemo(() => (Math.random() - 0.5) * 20, []);
  const randomInitialRotateZ = useMemo(
    () => Math.floor(Math.random() * 360),
    []
  );
  const randomSpinDuration = useMemo(() => Math.random() * 0.4 + 0.4, []); // Duration between 0.4 and 0.8 seconds
  const randomRotateX = useMemo(() => Math.random() * 90 - 45, []); // between -45 and 45°
  const randomRotateY = useMemo(() => Math.random() * 90 - 45, []); // between -45 and 45°

  return (
    // Add a parent container with perspective for a 3D view
    <div className="dice-roll-wrapper" style={{ perspective: "800px" }}>
      <motion.div
        className="dice-roll-container"
        initial={{
          x: randomX,
          y: -100,
          rotate: randomInitialRotateZ,
          rotateX: randomRotateX,
          rotateY: randomRotateY,
          opacity: 0,
        }}
        animate={{
          // The dice lands with a slight random X offset instead of zero
          x: randomFinalX,
          y: 0,
          rotate: randomInitialRotateZ + 360,
          rotateX: 0,
          rotateY: 0,
          opacity: 1,
        }}
        transition={{
          // Horizontal movement remains a spring with no bounce for smooth landing
          x: { type: "spring", stiffness: 300, damping: 10, bounce: 0 },
          // Vertical motion now has a bounce effect to simulate impact
          y: { type: "spring", stiffness: 400, damping: 15, bounce: 0.4 },
          // Use a refined easing curve for the rotations
          rotate: { duration: randomSpinDuration, ease: [0.22, 1, 0.36, 1] },
          rotateX: { duration: randomSpinDuration, ease: [0.22, 1, 0.36, 1] },
          rotateY: { duration: randomSpinDuration, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.2 },
        }}
        style={{
          display: "inline-block",
          margin: "0 8px",
          position: "relative",
          width: "70px",
          height: "70px",
          // Subtle shadow to ground the dice
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <svg
          fill="#ffffff"
          width="70"
          height="70"
          viewBox="-16 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          className="dice-roll"
        >
          <path d="M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07-108.64-190.1zM7.41 315.43L82.7 193.08 6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9l-76.64 45.99 75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1 208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75 340.43 208H240z" />
        </svg>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // Delay the face reveal until the dice is nearly settled
          transition={{ delay: randomSpinDuration * 0.8, duration: 0.2 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "12px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          {value}
        </motion.div>
      </motion.div>
    </div>
  );
}

interface DiceDisplayProps {
  message: Message;
}

export function DiceDisplay({ message }: DiceDisplayProps) {
  const diceRolls = message.toolInvocations?.filter(
    (invocation) =>
      invocation.toolName === "combatCalculation" &&
      invocation.state === "result"
  );

  if (!diceRolls?.length) return null;

  return (
    <div className="flex flex-col items-center gap-4 my-8">
      <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="dice-rolls flex gap-4 justify-center">
          {diceRolls.map((dice, index) => {
            const result = (dice as any).result;
            if (
              result &&
              typeof result === "object" &&
              result.roll1 !== undefined &&
              result.roll2 !== undefined
            ) {
              return (
                <div key={index} className="flex gap-8">
                  <div className="flex flex-col items-center">
                    <DiceRoll
                      value={result.roll1}
                      sides={(dice.args && (dice.args as any).sides) || 20}
                    />
                    <div className="flex items-center gap-1 mt-2">
                      <Sword size={16} />
                      <span>Attaquant</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <DiceRoll
                      value={result.roll2}
                      sides={(dice.args && (dice.args as any).sides) || 20}
                    />
                    <div className="flex items-center gap-1 mt-2">
                      <ShieldHalf size={16} />
                      <span>Défenseur</span>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <DiceRoll
                key={index}
                value={result as number}
                sides={(dice.args && (dice.args as any).sides) || 20}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
