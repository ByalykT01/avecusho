"use client";

import { useState } from "react";
import Image from "next/image";
import { RoleGate } from "~/components/auth/role-gate";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Heart, PartyPopper, X } from "lucide-react";
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
}

const dateQuestions: DateQuestion[] = [
  {
    question: "Where would you like to go?",
    options: [
      {
        id: "cinema",
        title: "Cinema",
        imageUrl:
          "https://utfs.io/f/9p4lEQTK2OGEni9lwHas6AMKy2wzjiSQVITbDeNLPadY758B",
      },
      {
        id: "restaurant",
        title: "Restaurant",
        imageUrl:
          "https://utfs.io/f/9p4lEQTK2OGEw929E5SFUYh6VmCk1MEIilnrytsqNbcOFWJD",
      },
      {
        id: "home",
        title: "Cozy evening at my place",
        imageUrl:
          "https://utfs.io/f/9p4lEQTK2OGEIu9v8fOXDVsYEAJ02epzNby6khf1r8TwCLUl",
      },
    ],
  },
  {
    question: "What time works best for you?",
    options: [
      {
        id: "afternoon",
        title: "Afternoon",
        imageUrl:
          "https://utfs.io/f/9p4lEQTK2OGEZL9rDtbJkpsTUIrCl8jSQnxNR2bMYV0y3KA9",
      },
      {
        id: "evening",
        title: "Evening",
        imageUrl:
          "https://utfs.io/f/9p4lEQTK2OGE7shTOTN4YfdVwhNWgQRHky18TlFSqbpnxOMK",
      },
    ],
  },
  {
    question: "What kind of mood would you prefer?",
    options: [
      {
        id: "romantic",
        title: "Romantic & Intimate",
        imageUrl:
          "https://utfs.io/f/9p4lEQTK2OGEY1jAaBlay1PUz0ils2u4nBkqI9KxHLwAVhbd",
      },
      {
        id: "fun",
        title: "Fun & Playful",
        imageUrl:
          "https://utfs.io/f/9p4lEQTK2OGExJxLlYewcHSJvpumhKiFtCQj26xZ91Wy5BI7",
      },
      {
        id: "relaxed",
        title: "Calm & Relaxed",
        imageUrl:
          "https://utfs.io/f/9p4lEQTK2OGEUwmaFvIconZG7lz61WOwm2LAJdgVT0QsaNHi",
      },
    ],
  },
  {
    question: "Would you like me to bring you something special?",
    options: [
      {
        id: "flowers",
        title: "Flowers",
        imageUrl:
          "https://utfs.io/f/9p4lEQTK2OGEt9db2dwpci78IBW1sHr93lw5OygeQ6RtmzdD",
      },
      {
        id: "chocolate_box",
        title: "Box of Chocolates",
        imageUrl:
          "https://utfs.io/f/9p4lEQTK2OGEU1PwFdIconZG7lz61WOwm2LAJdgVT0QsaNHi",
      },
      {
        id: "surprise",
        title: "Surprise Me",
        imageUrl:
          "https://utfs.io/f/9p4lEQTK2OGEM5N9HNH2gckHYyzXKIlqBnLb4Or8jJWAp2Zw",
      },
    ],
  },
];

export default function SpecialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<string[]>([]);
  const [showFinal, setShowFinal] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [stNicholasGift, setStNicholasGift] = useState<string>("");

  const handleSelection = (value: string) => {
    const newSelections = [...selections];
    newSelections[currentStep] = value;
    setSelections(newSelections);
  };

  async function submitDateRequest(selections: string[]) {
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
      throw error;
    }
  }

  const handleNext = async () => {
    if (currentStep < dateQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await submitDateRequest(selections);
        setShowFinal(true);
        void confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (error) {
        toast.error("Failed to save date request");
      }
    }
  };

  const handleReject = () => {
    setRejected(true);
  };

  return (
    <RoleGate allowedRole="ADMIN">
      <div className="min-h-screen w-full bg-gradient-to-b from-pink-50 to-purple-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          {!showFinal && !rejected ? (
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <h1 className="mb-8 text-center text-3xl font-bold text-pink-600">
                {dateQuestions[currentStep].question}
              </h1>

              <RadioGroup
                className="grid gap-8 md:grid-cols-3"
                value={selections[currentStep]}
                onValueChange={handleSelection}
              >
                {dateQuestions[currentStep].options.map((option) => (
                  <div
                    key={option.id}
                    className="relative flex flex-col items-center"
                  >
                    <Label
                      htmlFor={option.id}
                      className="group cursor-pointer space-y-3"
                    >
                      <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg">
                        <Image
                          src={option.imageUrl}
                          alt={option.title}
                          width={300}
                          height={200}
                          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="text-center">
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="peer sr-only"
                        />
                        <span className="text-lg font-medium text-gray-700">
                          {option.title}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {currentStep === dateQuestions.length - 1 && (
                <div className="mt-8 space-y-4">
                  <div className="rounded-lg border-2 border-pink-200 bg-pink-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-pink-600">
                      Special Question for St. Nicholas Day 🎅
                    </h3>
                    <p className="mb-4 text-gray-600">
                      Since St. Nicholas Day is coming up (December 6th), what
                      special gift would make you happy?
                    </p>
                    <Input
                      placeholder="Tell me your wish..."
                      value={stNicholasGift}
                      onChange={(e) => setStNicholasGift(e.target.value)}
                      className="border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-center space-x-4">
                <Button
                  onClick={handleNext}
                  disabled={!selections[currentStep]}
                  className="group relative inline-flex items-center justify-start overflow-hidden rounded-lg bg-pink-500 px-6 py-3 font-medium transition-all hover:bg-pink-600"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {currentStep === dateQuestions.length - 1 ? "Complete" : "Next"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  className="group relative inline-flex items-center justify-start overflow-hidden rounded-lg px-6 py-3 font-medium transition-all"
                >
                  <X className="mr-2 h-4 w-4" />
                  No, thank you
                </Button>
              </div>
            </div>
          ) : rejected ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Oh no! Maybe next time? 😢
              </h2>
              <p className="text-gray-600">
                I'll try to come up with something better!
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-8 text-center shadow-lg">
              <PartyPopper className="mx-auto h-16 w-16 text-pink-500" />
              <h2 className="mb-4 text-3xl font-bold text-pink-600">
                Yay! It's a date! 🎉
              </h2>
              <p className="mb-8 text-xl text-gray-600">
                I can't wait to spend time with you!
              </p>
              <div className="mt-8 text-left max-w-md mx-auto">
                <h3 className="mb-4 text-lg font-semibold text-gray-700">
                  Our Perfect Date Plan:
                </h3>
                <ul className="space-y-4">
                  {selections.map((selection, index) => {
                    const question = dateQuestions[index];
                    const selectedOption = question.options.find(
                      (opt) => opt.id === selection,
                    );
                    return (
                      <li key={index} className="flex items-start space-x-2">
                        <Heart className="h-5 w-5 text-pink-500 mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-700">
                            {question.question}
                          </span>
                          <p className="text-gray-600">{selectedOption?.title}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {stNicholasGift && (
                  <div className="mt-6 rounded-lg bg-pink-50 p-4">
                    <h4 className="mb-2 text-md font-semibold text-pink-600">
                      Your St. Nicholas Day Wish 🎁
                    </h4>
                    <p className="text-gray-700">{stNicholasGift}</p>
                  </div>
                )}
              </div>
              <p className="mt-8 text-lg text-pink-600 font-medium">
                See you soon! 💖
              </p>
            </div>
          )}
        </div>
      </div>
    </RoleGate>
  );
}