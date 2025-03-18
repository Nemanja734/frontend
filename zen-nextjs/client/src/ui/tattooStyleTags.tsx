import Text from "./text";

interface Props {
  styles: string[];
}

export default function TattooStyleTags({ styles }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {styles.map((style, index) => (
        <div key={index} className="px-4 py-1 bg-tint w-fit rounded-2xl shadow-[3px_3px_0_0_var(--foreground)] border-1 border-foreground">
          <Text level="sm">{style}</Text>
        </div>
      ))}
    </div>
  );
}
