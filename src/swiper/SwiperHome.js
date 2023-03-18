import React from "react";
import { Navigation, Scrollbar, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCard from "./SwiperCard";
const SwiperHome = ({ num, data }) => {
	return (
		<Swiper
			modules={[Navigation, Autoplay, Scrollbar]}
			spaceBetween={10}
			slidesPerView={num}
			navigation
			scrollbar={{ draggable: true }}
			autoplay={{
				delay: 2000,
				disableOnInteraction: false,
			}}
			loop
		>
			{data?.map((item) => (
				<SwiperSlide key={item?._id}>
					<SwiperCard item={item} />
				</SwiperSlide>
			))}
		</Swiper>
	);
};

export default SwiperHome;
