import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../App";
import {
	isFailing,
	isLoading,
	isLogOut,
	isSuccess,
} from "../../redux/slice/auth";
import "./style.css";
import HeaderSliceA from "./HeaderSliceA";
import HeaderSliceD from "./HeaderSliceD";
import KindsNavbar from "../another/KindsNavbar";

const Header = () => {
	const { store, cache, queue, handleCheck, count } = useContext(UserContext);

	const auth = useSelector((state) => state.auth);

	const [headerSlice, setHeaderSlice] = useState(false);

	const dispatch = useDispatch();

	const [kinds, setKinds] = useState([]);
	const [countries, setCountries] = useState([]);

	const handleSignOut = () => {
		dispatch(isLogOut());
		toast.success("Đăng xuất thành công.");
	};

	useEffect(() => {
		if (!handleCheck("/api/kind")) {
			queue.push({
				type: "GET",
				url: "/api/kind",
			});
		}
		if (!handleCheck("/api/country")) {
			queue.push({
				type: "GET",
				url: "/api/country",
			});
		}
	}, []);

	useEffect(() => {
		if (cache.current["/api/kind"]) {
			setKinds(cache.current["/api/kind"]?.kinds);
		}
		if (cache.current["/api/country"]) {
			setCountries(cache.current["/api/country"]?.countries);
		}
	}, [count]);

	return (
		<div className="header_wrap">
			<div className="header_wrap-head">
				<div className="grid wideS">
					<div className="row">
						<div className="col c-1 m-2 l-3">
							<Link to="/">
								<div className="header_brand_container">
									<img src="https://res.cloudinary.com/sttruyen/image/upload/v1660379654/295631243_1022629278418391_936904009150532582_n_rdsnbh.png" />
								</div>
							</Link>
						</div>
						<div className="col c-10 m-6 l-6">
							<div className="header-search_container">
								<div className="header-search_wrap">
									<input type="text" placeholder="Tìm truyện" />
									<div className="header-search_icons">
										<i className="fa-solid fa-magnifying-glass"></i>
									</div>
								</div>
							</div>
						</div>
						<div className="col c-0 m-4 l-3">
							{auth.user?.accessToken ? (
								<div className="auth_container">
									<div className="auth_container_exist">
										<div className="auth_container_image">
											<img src={auth.user?.image} />
										</div>
										<div className="auth_container_name">
											<p className="auth_container_name_detail">
												{auth.user?.name}
											</p>
											<i className="fa-solid fa-sort-down"></i>
										</div>
										<div className="auth_container_exist_detail">
											{store.rule === "admin" && (
												<Link
													style={{
														textDecoration: "none",
													}}
													to="/admin/manager"
												>
													<div className="auth_container_exist_detail_items">
														<p>Quản lý</p>
													</div>
												</Link>
											)}
											{store.rule === "admin" && (
												<Link
													style={{
														textDecoration: "none",
													}}
													to="/report/manager"
												>
													<div className="auth_container_exist_detail_items">
														<p>Report</p>
													</div>
												</Link>
											)}
											{store.rule === "admin" && (
												<Link
													style={{
														textDecoration: "none",
													}}
													to="/admin/user/manager"
												>
													<div className="auth_container_exist_detail_items">
														<p>User Manager</p>
													</div>
												</Link>
											)}
											<Link
												className="auth_container_exist_detail_items_Links"
												style={{
													textDecoration: "none",
												}}
												to="/user/manager"
											>
												<div className="auth_container_exist_detail_items">
													<p>Thông tin</p>
												</div>
											</Link>
											<Link
												className="auth_container_exist_detail_items_Links"
												style={{
													textDecoration: "none",
												}}
												to="/auth/change_password"
											>
												<div className="auth_container_exist_detail_items">
													<p>Đổi mật khẩu</p>
												</div>
											</Link>
											<div
												onClick={handleSignOut}
												className="auth_container_exist_detail_items"
											>
												<p>Đăng xuất</p>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className="auth_container">
									<Link className="auth_link" to="/login">
										<span>Đăng Nhập /</span>
									</Link>
									<Link className="auth_link" to="/register">
										<span>Đăng Ký</span>
									</Link>
								</div>
							)}
						</div>
						<div className="col c-1 m-0 l-0">
							<div className="mobile_header-bars">
								<i
									onClick={() => {
										setHeaderSlice(true);
									}}
									className="fa-solid fa-bars mobile_icons"
								></i>
							</div>
							<HeaderSliceA
								kinds={kinds}
								countries={countries}
								headerSlice={headerSlice}
								setHeaderSlice={setHeaderSlice}
							/>
							<HeaderSliceD
								headerSlice={headerSlice}
								setHeaderSlice={setHeaderSlice}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="header_wrap-footer">
				<div className="navbar_container">
					<div className="grid wideS">
						<div className="row">
							<div className="col c-0 m-12 l-12">
								<ul className="navbar_lists_wrap">
									<li>
										<Link className="navbar_items" to="/">
											<div className="navbar_item-infor">Trang Chủ</div>
										</Link>
									</li>
									<li>
										<Link className="navbar_items" to="/user/truyen-da-doc">
											<div className="navbar_item-infor">Truyện Đã Đọc</div>
										</Link>
									</li>
									<li>
										<Link className="navbar_items" to="/user/truyen-theo-doi">
											<div className="navbar_item-infor">Truyện Theo Dõi</div>
										</Link>
									</li>
									<li>
										<Link className="navbar_items" to="/tim-kiem?sort=-watchs">
											<div className="navbar_item-infor">Truyện Top</div>
										</Link>
									</li>
									<li>
										<Link className="navbar_items" to="/tim-kiem">
											<div className="navbar_item-infor">Truyện Mới</div>
										</Link>
									</li>
									<KindsNavbar
										item={kinds}
										slug="/tim-kiem?kind="
										name="Thể Loại"
									/>
									<KindsNavbar
										item={countries}
										slug="/tim-kiem?country="
										name="Quốc Gia"
									/>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
