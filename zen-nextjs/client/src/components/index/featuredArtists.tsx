"use client";

import Heading from "@/ui/heading";
import { artist } from "@/config/mock/artistsFeatured";
import ArtistTileSquared from "../artistCardSquared";
import Button from "@/ui/button";
import { routes } from "@/config/data/routes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ArtistTileDesktop from "../artistCardSwiper";

export default function FeaturedArtists() {
  return (
    <div className="container">
      <Heading level="heading-primary" className="text-center">
        Unsere vorgestellten Tätowierer
      </Heading>

      <Swiper
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        effect={'creative'}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }}
        observer
        observeParents
        spaceBetween={30}
        modules={[EffectCreative, Pagination]}
        className="md:hidden!"
      >
        {artist.map((artist, index) => (
          <SwiperSlide key={index} className="h-auto!">
            <ArtistTileSquared {...artist} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-5">
        {artist.map((artist, index) => (
          <ArtistTileDesktop key={index} {...artist} />
        ))}
      </div>

      <Button level="primary-lg" className="w-full sm:w-fit sm:mx-auto heading-primary-mt" href={routes.showroom}>
        Alle Tätowierer entdecken
      </Button>
    </div>
  );
}
