import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

// Import your images from assets
import step1Img from "@/assets/image-13.png";
import step2Img from "@/assets/image-14.png";
import step3Img from "@/assets/image-15.png";
import step4Img from "@/assets/image-16.png";
import step5Img from "@/assets/image-17.png";
import step6Img from "@/assets/image-18.png";

type StepItem = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const STEPS: StepItem[] = [
  {
    id: 1,
    title: "Open Homepage",
    description: "Navigate to the homepage to start.",
    image: step1Img,
  },
  {
    id: 2,
    title: "Sign In",
    description: "Enter your credentials to log in.",
    image: step2Img,
  },
  {
    id: 3,
    title: "Report an Incident",
    description: "Click 'File New Complaint or Create your first complaint' and fill in the details.",
    image: step3Img,
  },
  {
    id: 4,
    title: "Fill the complaint form",
    description:
      "Provide detailed information about the incident, including any evidence you have.",
    image: step4Img,
  },

   {
    id: 5,
    title: "Click Submit",
    description:
      "After filling out the form, click the 'Submit' button to file your complaint.",
    image: step5Img,
  },

   {
    id: 6,
    title: "Track your complaint",
    description:
      "You can monitor the status of your complaint in the dashboard.",
    image: step6Img,
  },
];

export function Guidepage() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const step = STEPS[currentStep];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-indigo-50 to-fuchsia-50 relative py-12">
        <div className="container mx-auto px-4">

          {/* Header */}
          <header className="mb-10 text-center">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-fuchsia-600 to-amber-600 bg-clip-text text-transparent">
              Step-by-Step Guide
            </h1>
            <p className="mt-4 text-gray-700 text-lg max-w-3xl mx-auto">
              Follow these simple steps to use our platform safely and efficiently.
            </p>
          </header>

          {/* Step Card */}
          <div className="rounded-3xl bg-white shadow-md p-8 mx-auto max-w-3xl flex flex-col items-center">
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-64 object-contain rounded-xl mb-6"
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
              <p className="text-gray-700">{step.description}</p>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex justify-between w-full">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                <ArrowRight className="rotate-180 w-4 h-4" />
                Previous
              </button>
              {currentStep === STEPS.length - 1 ? (
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-green-200 text-green-800 cursor-default"
                >
                  <CheckCircle className="w-4 h-4" /> Done
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              
            </div>

            {/* Step Indicator */}
            <div className="mt-6 flex gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={`w-3 h-3 rounded-full ${
                    i === currentStep ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
