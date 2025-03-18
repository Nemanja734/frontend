import clsx from "clsx";
import Image from "next/image";

interface Props {
  color: string;
  image: string;
  children: React.ReactNode;
}

export default function BenefitsCard({ color, image, children }: Props) {
  return (
    <div className={clsx(color, "p-[20px] md:p-[40px] rounded-lg")}>
      <div className="h-50 w-50 relative m-auto mb-6 md:mb-12">
        <Image
          src={image}
          fill={true}
          alt="Illustration of the benefit"
          className="object-cover"
        ></Image>
      </div>
      {children}
    </div>
  );
}
