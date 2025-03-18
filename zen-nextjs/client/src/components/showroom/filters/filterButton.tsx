import Button from "@/ui/button";
import Icon from "@/ui/icon";
import clsx from "clsx";

interface Props {
  isActive?: boolean;
  reset?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

export default function FilterButton({
  isActive = false,
  reset = false,
  onClick,
  children,
}: Props) {
  return (
    <>
      {reset ? (
        <Button level="black-lg" onClick={onClick}>
          Filter Zurücksetzen
        </Button>
      ) : (
        <Button
          level="stroke-lg"
          onClick={onClick}
          className={clsx(isActive && "bg-tint font-semibold")}
        >
          {children} &ensp;
          <Icon name="chevDown" size="xs" />
        </Button>
      )}
    </>
  );
}
