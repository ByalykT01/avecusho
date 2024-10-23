import { Button } from "../ui/button";

interface RemoveButtonProps {
  onClick: () => void;
}

export function RemoveButton({ onClick }: RemoveButtonProps) {
  return (
    <Button
      className="w-full rounded-md px-4 py-2 text-lg font-medium text-black hover:bg-gray-200"
      variant="secondary"
      onClick={onClick}
    >
      <p>Remove</p>
    </Button>
  );
}
