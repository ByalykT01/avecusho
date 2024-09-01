interface HeaderProps {
  label: string;
}

export function Header({ label }: HeaderProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <h1> Header</h1>
      <p className="text-sm text-muted-foreground">{label} </p>
    </div>
  );
}
