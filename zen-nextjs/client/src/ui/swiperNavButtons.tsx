import { useSwiper } from "swiper/react";
import Icon from "./icon";

export default function SwiperNavButtons() {
  const swiper = useSwiper();

  const buttonStyle = "bg-tint-transparent p-1 rounded-full grid place-items-center cursor-pointer"

  return (
    <div className="swiper-nav-btns absolute z-10 top-1/2 -translate-y-1/2 flex justify-between w-full px-2">
      <button onClick={() => swiper.slidePrev()} className={buttonStyle}>
        <Icon name="chevDown" className="rotate-90" />
      </button>
      <button onClick={() => swiper.slideNext()} className={buttonStyle}>
        <Icon name="chevDown" className="-rotate-90" />
      </button>
    </div>
  );
}
