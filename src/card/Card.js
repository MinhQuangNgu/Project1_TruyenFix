import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import moment from "moment";
import localization from "moment/locale/vi";
const Card = ({ item }) => {
	const ratingRef = useRef(0);
	moment.locale("vi", localization);

	const [update, setUpdate] = useState(false);

	const clipPath = {
		clipPath: `inset(0 ${100 - ratingRef.current * 100}% 0 0)`,
	};

	useEffect(() => {
		if (item) {
			ratingRef.current = item?.stars / (item?.reviewers * 5);
			setUpdate(!update);
		}
	}, [item]);
	return (
		<div className="card_container">
			<Link to={`/${item?.slug}`}>
				<div className="card_image_container">
					<img src={item?.image} />
					<div className="card_image_infor">
						<div className="card_image_infor_watch">
							<h3>
								<i
									style={{ marginRight: "0.3rem" }}
									className="fa-solid fa-eye"
								></i>
								{item?.watchs}
							</h3>
						</div>
						<div className="card_image_infor_rating">
							<i className="fa-regular fa-star"></i>
							<i className="fa-regular fa-star"></i>
							<i className="fa-regular fa-star"></i>
							<i className="fa-regular fa-star"></i>
							<i className="fa-regular fa-star"></i>
							<div style={clipPath} className="card_image_infor_rating-lights">
								<i className="fa-solid fa-star"></i>
								<i className="fa-solid fa-star"></i>
								<i className="fa-solid fa-star"></i>
								<i className="fa-solid fa-star"></i>
								<i className="fa-solid fa-star"></i>
							</div>
						</div>
					</div>
				</div>
			</Link>
			<div className="card_infor">
				<Link className="card_infor_title_wrap" to={`/${item?.slug}`}>
					<div className="card_infor_title">{item?.title}</div>
				</Link>
				<Link className="card_infor_title_wrap" to={`/${item?.slug}`}>
					<div className="card_infor_chapter_detail">
						Chapter {item?.chapters?.length}
					</div>
				</Link>
			</div>
			<div className="update_time_container">
				{item?.chapters?.length > 0
					? moment(
							item?.chapters[item?.chapters?.length - 1]?.createdAt
					  ).fromNow()
					: "Chưa cập nhật"}
			</div>
		</div>
	);
};

export default Card;
