import { Button } from "../ui/button";

interface BuyButtonProps {
  onClick: () => void;
}

export function BuyButton({ onClick }: BuyButtonProps) {
  return (
    <Button
      className="bg-button_initial py-3 px-6 text-lg font-semibold hover:bg-button_onhover w-full rounded-md"
      onClick={onClick}
    >
      <p>Buy</p>
    </Button>
  );
}
