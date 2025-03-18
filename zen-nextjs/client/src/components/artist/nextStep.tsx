import Text from "../../ui/text";

interface Props {
  children: React.ReactNode;
  index: number;
}

export default function NextStep({ children, index }: Props) {
  return (
    <div className="grid justify-items-center content-start gap-2 text-center bg-white p-2 md:p-5 rounded-lg w-full shadow-md">
      <div className="w-[60px] h-[60px] grid place-items-center bg-primary-tint rounded-full">
        <Text level="2xl" customs="text-primary">
          {index + 1}
        </Text>
      </div>
      <Text level="xl">{children}</Text>
    </div>
  );
}
