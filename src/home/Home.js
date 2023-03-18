import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { useDispatch } from "react-redux";
import { isFailing, isLoading, isSuccess } from "../redux/slice/auth";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import SwiperHome from "../swiper/SwiperHome";
import KindNavHome from "./KindNavHome";
const Home = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const [newComic, setNewComic] = useState([]);
	const [watchComic, setWatchComic] = useState([]);
	const [follows, setFollows] = useState([]);
	const [likes, setLikes] = useState([]);

	const { cache, queue, count, setCount } = useContext(UserContext);
	const handleCheck = (url) => {
		return queue?.some((item) => item?.url === url);
	};

	useEffect(() => {
		let update = false;
		if (
			!handleCheck("/api/movie?sort=likes&limit=10") &&
			!cache.current["/api/movie?sort=likes&limit=10"]
		) {
			queue.push({
				type: "GET",
				url: "/api/movie?sort=likes&limit=10",
			});
			update = true;
		}

		if (
			!handleCheck("/api/movie?sort=-follows&limit=10") &&
			!cache.current["/api/movie?sort=-follows&limit=10"]
		) {
			queue.push({
				type: "GET",
				url: "/api/movie?sort=-follows&limit=10",
			});
			update = true;
		}

		if (
			!handleCheck("/api/movie?sort=-watchs&limit=10") &&
			!cache.current["/api/movie?sort=-watchs&limit=10"]
		) {
			queue.push({
				type: "GET",
				url: "/api/movie?sort=-watchs&limit=10",
			});
			update = true;
		}
		if (
			!handleCheck("/api/movie?limit=10") &&
			!cache.current["/api/movie?limit=10"]
		) {
			queue.push({
				type: "GET",
				url: "/api/movie?limit=10",
			});
		}
		if (update) {
			setCount((prev) => prev + 1);
		}
	}, []);

	useEffect(() => {
		if (cache.current["/api/movie?limit=10"]) {
			cache.current["/api/movie?limit=10"]?.Products?.forEach((infor) => {
				const url = `/api/movie/${infor?.slug}`;
				if (!cache.current[url]) {
					cache.current[url] = infor;
				}
			});
			setNewComic(cache.current["/api/movie?limit=10"]?.Products);
		}
		if (cache.current["/api/movie?sort=-watchs&limit=10"]) {
			cache.current["/api/movie?sort=-watchs&limit=10"]?.Products?.forEach(
				(infor) => {
					const url = `/api/movie/${infor?.slug}`;
					if (!cache.current[url]) {
						cache.current[url] = infor;
					}
				}
			);
			setWatchComic(
				cache.current["/api/movie?sort=-watchs&limit=10"]?.Products
			);
		}
		if (cache.current["/api/movie?sort=-follows&limit=10"]) {
			cache.current["/api/movie?sort=-follows&limit=10"]?.Products?.forEach(
				(infor) => {
					const url = `/api/movie/${infor?.slug}`;
					if (!cache.current[url]) {
						cache.current[url] = infor;
					}
				}
			);
			setFollows(cache.current["/api/movie?sort=-follows&limit=10"]?.Products);
		}
		if (cache.current["/api/movie?sort=likes&limit=10"]) {
			cache.current["/api/movie?sort=likes&limit=10"]?.Products?.forEach(
				(infor) => {
					const url = `/api/movie/${infor?.slug}`;
					if (!cache.current[url]) {
						cache.current[url] = infor;
					}
				}
			);
			setLikes(cache.current["/api/movie?sort=likes&limit=10"]?.Products);
		}
	}, [count]);

	return (
		<div className="home_container">
			<HelmetProvider>
				<Helmet>
					<title>Thế Giới Truyện</title>
					<link rel="canonical" href="https//stphim.xyz" />
					<meta
						property="o:description"
						content="Stphim là web đọc truyện mọi thể loại, chúng tôi hy vọng rằng bạn sẽ có 1 buổi đọc truyện thật tuyệt vời."
					/>
				</Helmet>
			</HelmetProvider>
			<div className="grid wideS">
				<div className="home_wrap">
					<div className="home_top_container">
						<div className="home_top-title">
							<h1>Truyện Top</h1>
						</div>
						<div className="row">
							<div className="col c-12 m-0 l-0">
								<SwiperHome data={watchComic} num={2} />
							</div>
							<div className="col c-0 m-12 l-12">
								<SwiperHome data={watchComic} num={5} />
							</div>
						</div>
						<KindNavHome data={newComic} name="truyện mới" />
						<KindNavHome data={watchComic} name="truyện xem nhiều" />
						<KindNavHome data={follows} name="truyện nhiều lượt theo dõi" />
						<KindNavHome data={likes} name="truyện nhiều lượt thích" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
