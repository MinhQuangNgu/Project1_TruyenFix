import { createContext, useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { privateRouter, publicRouter } from "./routes/routes";
import "./style.css";
import Loading from "./loading/Loading";
import { isFailing, isLoading, isLogin, isSuccess } from "./redux/slice/auth";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import NotFound from "./notfound/NotFound";
export const UserContext = createContext();
function App() {
	const cache = useRef({});

	const [socket, setSocket] = useState("");
	const [store, setStore] = useState({ rule: "user" });

	const auth = useSelector((state) => state.auth);

	const dispatch = useDispatch();

	useEffect(() => {
		const socket = io("http://localhost:5000");
		setSocket(socket);
		return () => {
			socket.close();
		};
	}, []);
	const queue = useRef([]);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (queue.current?.length === 0) {
			return;
		}
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();
		const url = queue.current[queue.current?.length - 1]?.url;
		if (cache[url]) {
			return queue.pop();
		}
		switch (queue.current[queue.current?.length - 1]?.type) {
			case "POST":
				axios
					.post(
						url,
						{
							...queue.current[queue.current?.length - 1]?.data,
						},
						{
							cancelToken: source.token,
						}
					)
					.then((res) => {
						cache.current[url] = res?.data;
						queue.current.pop();
						dispatch(isSuccess());
						setCount((prev) => prev + 1);
					})
					.catch((err) => {
						if (err?.response?.data) {
							setCount((prev) => prev + 1);
						}
						dispatch(isFailing());
					});
				break;
			case "GET":
				axios
					.get(url, {
						cancelToken: source.token,
					})
					.then((res) => {
						cache.current[url] = res?.data;
						queue.current.pop();
						dispatch(isSuccess());
						setCount((prev) => prev + 1);
					})
					.catch((err) => {
						if (err?.response?.data) {
							setCount((prev) => prev + 1);
						}
						dispatch(isFailing());
					});
				break;
			case "DELETE":
				axios
					.delete(url, {
						cancelToken: source.token,
					})
					.then((res) => {
						cache.current[url] = res?.data;
						queue.current.pop();
						dispatch(isSuccess());
						setCount((prev) => prev + 1);
					})
					.catch((err) => {
						if (err?.response?.data) {
							setCount((prev) => prev + 1);
						}
						dispatch(isFailing());
					});

				break;
			case "PUT":
				axios
					.put(
						url,
						{
							...queue.current[queue.current?.length - 1]?.data,
						},
						{
							cancelToken: source.token,
						}
					)
					.then((res) => {
						cache.current[url] = res?.data;
						queue.current.pop();
						dispatch(isSuccess());
						setCount((prev) => prev + 1);
					})
					.catch((err) => {
						if (err?.response?.data) {
							setCount((prev) => prev + 1);
						}
						dispatch(isFailing());
					});

				break;
			default:
				break;
		}
		return () => {
			if (queue.current?.length > 0) {
				source.cancel("Cancel");
				dispatch(isFailing());
			}
		};
	}, [count, queue.current]);
	const checkToken = useCallback(async () => {
		const decoded = jwt_decode(auth.user?.accessToken);
		if (decoded.exp < Date.now() / 1000) {
			try {
				const refreshToken = Cookies.get("token");
				const data = await axios.get("/api/auth/token/refresh", {
					headers: {
						token: `Bearer ${refreshToken}`,
					},
				});
				dispatch(isLogin(data?.data));
				const decoded = jwt_decode(data?.data?.accessToken);
				Cookies.remove("token");
				Cookies.set("token", decoded?.refreshToken, {
					expires: 30,
				});
				return data?.data?.accessToken;
			} catch (err) {
				toast.error(err?.response?.data?.msg);
				return "";
			}
		}
		return "";
	});
	const handleCheck = (url) => {
		return queue?.current?.some((item) => item?.url === url);
	};

	useEffect(() => {
		if (auth.user?.accessToken) {
			const decoded = jwt_decode(auth.user?.accessToken);
			Cookies.remove("token");
			Cookies.set("token", decoded?.refreshToken, { expires: 30 });
			setStore({ rule: decoded.rule });
		}
	}, [auth.user?.accessToken]);

	return (
		<UserContext.Provider
			value={{
				store,
				setStore,
				checkToken,
				cache,
				socket,
				queue: queue.current,
				count,
				handleCheck,
				setCount,
			}}
		>
			<Router>
				<div className="App">
					<Routes>
						{privateRouter?.map((item, index) => {
							const Page = item.element;
							return item.defaultlayout ? (
								<Route
									key={index + "routerpriva"}
									path={item.path}
									element={
										<item.defaultlayout>
											<Page />
										</item.defaultlayout>
									}
								/>
							) : (
								<Route
									key={index + "routerpriva"}
									path={item.path}
									element={<Page />}
								/>
							);
						})}
						{publicRouter?.map((item, index) => {
							const Page = item.element;
							return item.defaultlayout ? (
								<Route
									key={index + "routerpublic"}
									path={item.path}
									element={
										<item.defaultlayout>
											<Page />
										</item.defaultlayout>
									}
								/>
							) : (
								<Route
									key={index + "routerpublic"}
									path={item.path}
									element={<Page />}
								/>
							);
						})}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</div>
				<div className="app-pc">
					<ToastContainer autoClose={1500} style={{ fontSize: "1.5rem" }} />
				</div>
				{auth.loading && <Loading />}
			</Router>
		</UserContext.Provider>
	);
}

export default App;
