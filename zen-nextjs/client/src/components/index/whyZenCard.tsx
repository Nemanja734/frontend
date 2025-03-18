import Heading from "@/ui/heading";
import Text from "@/ui/text";
import Icon from "@/ui/icon";

interface Props {
  icon: string;
  title: string;
  text: string;
}

export default function WhyZenCard({ icon, title, text }: Props) {
  return (
    <div className="flex flex-col gap-2 lg:gap-5 p-2 lg:p-8 text-center bg-background rounded-xl shadow-md">
      <Icon name={icon} size="3xl" color="var(--primary)" className="mx-auto" />
      <Heading level="subheading-primary">{title}</Heading>
      <Text level="base">{text}</Text>
    </div>
  );
}
