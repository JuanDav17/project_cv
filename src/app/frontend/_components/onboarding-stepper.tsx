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
  const progressWidth = `${((currentStep - 1) / (labels.length - 1)) * 100}%`;

  return (
    <div className="fp-stepper fp-stack-md">
      <div className="fp-stepper__track" />
      <div className="fp-stepper__progress" style={{ width: progressWidth }} />

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
                {isDone ? <MaterialIcon className="fp-label-sm">check</MaterialIcon> : step}
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
