"use client"

import Image from "next/image";
import { A11y, EffectCreative, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ArtistTileInformation from "./artistCardInformation";
import SwiperNavButtons from "@/ui/swiperNavButtons";
import "swiper/css";
import "swiper/css/pagination";

interface ArtistTileProp {
  portfolio: string[];
  firstName: string;
  lastName: string;
  postalCode: string;
  city: string;
  tattooStyle: string[];
  hourlyRate: number;
}

export default function ArtistCardSwiper(prop: ArtistTileProp) {
  return (
    <div className="bg-background flex flex-col border-1 rounded-sm overflow-hidden h-full">

      <div className="aspect-8/9">
        <Swiper
          pagination={{ dynamicBullets: true, clickable: true }}
          effect={"creative"}
          creativeEffect={{
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          }}
          modules={[Pagination, Navigation, EffectCreative, A11y]}
          className="h-full w-full"
        >
          {prop.portfolio.map((tattoo, index) => (
            <SwiperSlide key={index} className="relative h-full w-full">
              <Image
                src={tattoo}
                alt="Portfolio image of tattoo artist"
                fill
                className="object-cover"
              />
            </SwiperSlide>
          ))}

          <SwiperNavButtons />
        </Swiper>
      </div>

      <ArtistTileInformation {...prop} />
    </div>
  );
}
