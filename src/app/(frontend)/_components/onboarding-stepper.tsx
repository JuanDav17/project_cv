import { MaterialIcon } from "./material-icon";

type OnboardingStepperProps = {
  currentStep: number;
  labels: [string, string, string, string];
  mobileLabel: string;
};

export function OnboardingStepper({
  currentStep,
  labels,
  mobileLabel,
}: OnboardingStepperProps) {
  const totalSteps = labels.length;
  // La línea del track va del 12.5% (centro del 1er círculo) al 87.5% (centro del último).
  // El width del progress debe ser: inset_izq + ratio * (100% - 2*inset_izq)
  const trackInset = 12.5; // % — coincide con el CSS
  const ratio = (currentStep - 1) / (totalSteps - 1);
  const progressWidth = currentStep === 1 ? "0%" : `${trackInset + ratio * (100 - 2 * trackInset)}%`;

  return (
    <div className="fp-stepper">
      {/* Líneas de fondo y progreso — delimitadas al espacio entre círculos */}
      <div className="fp-stepper__track" />
      <div
        className="fp-stepper__progress"
        style={{ width: progressWidth }}
      />

      <div className="fp-stepper__items">
        {labels.map((label, index) => {
          const step = index + 1;
          const isDone = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div className="fp-stepper__item" key={label}>
              <div
                className={[
                  "fp-stepper__circle",
                  isDone ? "fp-stepper__circle--done" : "",
                  isCurrent ? "fp-stepper__circle--current" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isDone ? (
                  <MaterialIcon className="fp-label-sm">check</MaterialIcon>
                ) : (
                  step
                )}
              </div>
              <span
                className={[
                  "fp-stepper__label",
                  "fp-label-sm",
                  isCurrent ? "fp-stepper__label--active" : "fp-muted",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="fp-stepper__mobile fp-label-md">{mobileLabel}</div>
    </div>
  );
}
