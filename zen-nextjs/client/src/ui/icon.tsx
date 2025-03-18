import { IconType } from "react-icons";
import { CgProfile } from "react-icons/cg";
import { FaChevronDown } from "react-icons/fa6";
import { GrMail } from "react-icons/gr";
import { HiSearch } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsCalendar2CheckFill } from "react-icons/bs";
import { MdVerifiedUser } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa";
import { FaPhoenixSquadron } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { IoColorPaletteSharp } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const icons: { [key: string]: IconType } = {
  profile: CgProfile,
  chevDown: FaChevronDown,
  mail: GrMail,
  search: HiSearch,
  close: AiOutlineClose,
  menu: RxHamburgerMenu,
  calendar: BsCalendar2CheckFill,
  verified: MdVerifiedUser,
  businessTime: FaBusinessTime,
  customize: IoColorPaletteSharp,
  phoenix: FaPhoenixSquadron,
  like: AiFillLike,
  checkCircle: FaCheckCircle,
  location: FaLocationDot,
};

interface Props {
  name: keyof typeof icons;
  size?: string;
  sizeComputed?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export default function Icon({
  name,
  size,
  sizeComputed,
  color,
  className,
  onClick,
}: Props) {
  const SelectedIcon = icons[name];

  if (!SelectedIcon) console.warn("Icon not found: " + { name });

  if (!sizeComputed) {
    switch (size) {
      case "xs":
        sizeComputed = 16;
        break;

      case "sm":
        sizeComputed = 20;
        break;

      case "base":
        sizeComputed = 24;
        break;

      case "lg":
        sizeComputed = 30;
        break;

      case "xl":
        sizeComputed = 40;
        break;

      case "2xl":
        sizeComputed = 50;
        break;

      case "3xl":
        sizeComputed = 60;
        break;

      default:
        sizeComputed = 24;
    }
  }

  return (
    <SelectedIcon
      size={sizeComputed}
      color={color}
      className={className}
      onClick={onClick}
    />
  );
}
