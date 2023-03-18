import React, { useEffect } from "react";
import Card from "../card/Card";
import "./style.css";
const KindNavHome = ({ name, data }) => {
	return (
		<>
			<div className="home_top-title-2">
				<h3>{name}</h3>
			</div>
			<div className="row">
				{data?.map((item) => (
					<div key={item?._id} className="col c-6 m-3 l-2-4">
						<Card item={item} />
					</div>
				))}
			</div>
		</>
	);
};

export default KindNavHome;
