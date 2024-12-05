"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { RoleGate } from "~/components/auth/role-gate";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { 
  Heart, PartyPopper, GiftIcon, Sparkles, Clock, MapPin, Smile 
} from "lucide-react";
import confetti from "canvas-confetti";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";

interface DateOption {
  id: string;
  title: string;
  imageUrl: string;
}

interface DateQuestion {
  question: string;
  options: DateOption[];
  icon: React.ReactNode;
}

const DATE_QUESTIONS: DateQuestion[] = [
  {
    question: "Where would you like to go?",
    icon: <MapPin className="h-6 w-6 text-pink-500" />,
    options: [
      {
        id: "cinema",
        title: "Cinema",
        imageUrl: "https://utfs.io/f/9p4lEQTK2OGEni9lwHas6AMKy2wzjiSQVITbDeNLPadY758B",
      },
      {
        id: "restaurant",
        title: "Restaurant",
        imageUrl: "https://utfs.io/f/9p4lEQTK2OGEw929E5SFUYh6VmCk1MEIilnrytsqNbcOFWJD",
      },
      {
        id: "home",
        title: "Cozy evening at my place",
        imageUrl: "https://utfs.io/f/9p4lEQTK2OGEIu9v8fOXDVsYEAJ02epzNby6khf1r8TwCLUl",
      },
    ],
  },
  {
    question: "What time works best for you?",
    icon: <Clock className="h-6 w-6 text-pink-500" />,
    options: [
      {
        id: "afternoon",
        title: "Afternoon",
        imageUrl: "https://utfs.io/f/9p4lEQTK2OGEZL9rDtbJkpsTUIrCl8jSQnxNR2bMYV0y3KA9",
      },
      {
        id: "evening",
        title: "Evening",
        imageUrl: "https://utfs.io/f/9p4lEQTK2OGE7shTOTN4YfdVwhNWgQRHky18TlFSqbpnxOMK",
      },
    ],
  },
  {
    question: "What kind of mood would you prefer?",
    icon: <Smile className="h-6 w-6 text-pink-500" />,
    options: [
      {
        id: "romantic",
        title: "Romantic & Intimate",
        imageUrl: "https://utfs.io/f/9p4lEQTK2OGEY1jAaBlay1PUz0ils2u4nBkqI9KxHLwAVhbd",
      },
      {
        id: "fun",
        title: "Fun & Playful",
        imageUrl: "https://utfs.io/f/9p4lEQTK2OGExJxLlYewcHSJvpumhKiFtCQj26xZ91Wy5BI7",
      },
      {
        id: "relaxed",
        title: "Calm & Relaxed",
        imageUrl: "https://utfs.io/f/9p4lEQTK2OGEUwmaFvIconZG7lz61WOwm2LAJdgVT0QsaNHi",
      },
    ],
  },
  {
    question: "Would you like me to bring you something special?",
    icon: <GiftIcon className="h-6 w-6 text-pink-500" />,
    options: [
      {
        id: "flowers",
        title: "Flowers",
        imageUrl: "https://utfs.io/f/9p4lEQTK2OGEt9db2dwpci78IBW1sHr93lw5OygeQ6RtmzdD",
      },
      {
        id: "chocolate_box",
        title: "Box of Chocolates",
        imageUrl: "https://utfs.io/f/9p4lEQTK2OGEU1PwFdIconZG7lz61WOwm2LAJdgVT0QsaNHi",
      },
      {
        id: "surprise",
        title: "Surprise Me",
        imageUrl: "https://utfs.io/f/9p4lEQTK2OGEM5N9HNH2gckHYyzXKIlqBnLb4Or8jJWAp2Zw",
      },
    ],
  },
];

export default function SpecialDateRequestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<string[]>([]);
  const [showFinal, setShowFinal] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [stNicholasGift, setStNicholasGift] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelection = useCallback((value: string) => {
    setSelections(prev => {
      const newSelections = [...prev];
      newSelections[currentStep] = value;
      return newSelections;
    });
  }, [currentStep]);

  const submitDateRequest = useCallback(async (selections: string[]) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/date-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: selections[0],
          timePreference: selections[1],
          mood: selections[2],
          gift: selections[3],
          stNicholasGift: stNicholasGift,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit date request");
      }

      return await response.json();
    } catch (error) {
      console.error("Error submitting date request:", error);
      toast.error("Failed to save date request");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [stNicholasGift]);

  const handleNext = useCallback(async () => {
    if (currentStep < DATE_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      try {
        await submitDateRequest(selections);
        setShowFinal(true);
        void confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#FF69B4', '#FFC0CB', '#FF1493']
        });
      } catch (error) {
        // Error handling is done in submitDateRequest
      }
    }
  }, [currentStep, selections, submitDateRequest]);

  const currentQuestion = useMemo(() => 
    DATE_QUESTIONS[currentStep], [currentStep]
  );

  const renderProgressDots = useMemo(() => {
    return DATE_QUESTIONS.map((_, index) => (
      <div
        key={index}
        className={`h-2 w-2 rounded-full mx-1 transition-all duration-300 
          ${index <= currentStep ? 'bg-pink-500' : 'bg-pink-200'}`}
      />
    ));
  }, [currentStep]);

  const renderFinalDateSummary = useMemo(() => {
    return selections.map((selection, index) => {
      const question = DATE_QUESTIONS[index];
      const selectedOption = question?.options.find(
        (opt) => opt.id === selection,
      );
      return (
        <li 
          key={index} 
          className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-md"
        >
          <Heart className="h-6 w-6 text-pink-500 mt-1 flex-shrink-0" />
          <div>
            <span className="font-medium text-gray-800">
              {question?.question}
            </span>
            <p className="text-gray-600 font-semibold">{selectedOption?.title}</p>
          </div>
        </li>
      );
    });
  }, [selections]);

  if (rejected) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-pink-50 to-purple-100 py-12 flex items-center justify-center">
        <div className="rounded-2xl bg-white p-8 text-center shadow-2xl border-4 border-gray-200">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Oh no! Maybe next time? 😢
          </h2>
          <p className="text-gray-600">
            I'll try to come up with something better!
          </p>
        </div>
      </div>
    );
  }

  return (
    <RoleGate allowedRole="ADMIN">
      <div className="min-h-screen w-full bg-gradient-to-b from-pink-50 to-purple-100 py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl px-4">
          {!showFinal ? (
            <div className="rounded-2xl bg-white p-8 shadow-2xl border-4 border-pink-200 transform transition-all hover:scale-[1.02]">
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  {currentQuestion?.icon}
                  <h1 className="text-center text-3xl font-bold text-pink-600">
                    {currentQuestion?.question}
                  </h1>
                </div>
                <div className="flex justify-center mb-4">
                  {renderProgressDots}
                </div>
              </div>

              <RadioGroup
                className="grid gap-6 md:grid-cols-3"
                value={selections[currentStep]}
                onValueChange={handleSelection}
              >
                {currentQuestion?.options.map((option) => (
                  <div
                    key={option.id}
                    className="relative group"
                  >
                    <Label
                      htmlFor={option.id}
                      className="cursor-pointer block"
                    >
                      <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 
                        group-hover:shadow-2xl group-data-[state=checked]:border-4 group-data-[state=checked]:border-pink-500">
                        <Image
                          src={option.imageUrl}
                          alt={option.title}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="absolute top-2 right-2 opacity-0 group-data-[state=checked]:opacity-100"
                        />
                      </div>
                      <div className="mt-3 text-center">
                        <span className="text-lg font-medium text-gray-700 
                          group-data-[state=checked]:text-pink-600 group-data-[state=checked]:font-bold">
                          {option.title}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {currentStep === DATE_QUESTIONS.length - 1 && (
                <div className="mt-8 space-y-4">
                  <div className="rounded-lg border-2 border-pink-300 bg-pink-50/50 p-6 animate-pulse-soft">
                    <div className="flex items-center mb-4 space-x-2">
                      <Sparkles className="h-6 w-6 text-pink-500" />
                      <h3 className="text-xl font-semibold text-pink-600">
                        Special Question for St. Nicholas Day 🎅
                      </h3>
                    </div>
                    <p className="mb-4 text-gray-600">
                      Since St. Nicholas Day is coming up (December 6th), what special gift would make you happy?
                    </p>
                    <Input
                      placeholder="Tell me your heart's deepest wish..."
                      value={stNicholasGift}
                      onChange={(e) => setStNicholasGift(e.target.value)}
                      className="border-pink-300 focus:border-pink-500 focus:ring-pink-500 
                      transition-all duration-300 hover:shadow-lg"
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-center space-x-4">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="group relative inline-flex items-center justify-center rounded-full px-8 py-3 
                    font-medium text-pink-600 border-pink-300 hover:bg-pink-50"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!selections[currentStep] || isLoading}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-pink-500 px-8 py-3 
                  font-medium text-white shadow-xl transition-all hover:bg-pink-600 
                  focus:ring-4 focus:ring-pink-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Submitting...</span>
                  ) : (
                    <>
                      <Heart className="mr-2 h-5 w-5 animate-pulse" />
                      {currentStep === DATE_QUESTIONS.length - 1 ? "Complete" : "Next"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-8 text-center shadow-2xl border-4 border-pink-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 opacity-20 -z-10"></div>
              <PartyPopper className="mx-auto h-20 w-20 text-pink-500 animate-bounce" />
              <h2 className="mb-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                Yay! It's a date! 🎉
              </h2>
              <p className="mb-8 text-xl text-gray-600">
                I can't wait to spend time with you!
              </p>
              <div className="mt-8 text-left max-w-md mx-auto bg-pink-50/50 p-6 rounded-xl border border-pink-200">
                <h3 className="mb-4 text-lg font-semibold text-gray-700 flex items-center">
                  <Sparkles className="mr-2 h-6 w-6 text-pink-500" />
                  Our Perfect Date Plan:
                </h3>
                <ul className="space-y-4">
                  {renderFinalDateSummary}
                </ul>
                {stNicholasGift && (
                  <div className="mt-6 rounded-lg bg-pink-100 p-4 border border-pink-300">
                    <h4 className="mb-2 text-md font-semibold text-pink-600 flex items-center">
                      <GiftIcon className="mr-2 h-5 w-5 text-pink-500" />
                      Your St. Nicholas Day Wish 🎁
                    </h4>
                    <p className="text-gray-700 italic">{stNicholasGift}</p>
                  </div>
                )}
              </div>
              <p className="mt-8 text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-medium animate-pulse">
                See you soon, Aurora! 💖
              </p>
            </div>
          )}
        </div>
      </div>
    </RoleGate>
  );
}