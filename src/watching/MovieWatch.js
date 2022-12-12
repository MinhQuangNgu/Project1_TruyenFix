import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import localStorage from "redux-persist/es/storage";
import { UserContext } from "../App";
import ImageWatch from "./ImageWatch";
import "./style.css";
import NotFound from "../notfound/NotFound";
import ScrollTop from "../components/scroll/ScrollTop";
import { isFailing, isLoading, isLogin, isSuccess } from "../redux/slice/auth";
import CommentForm from "../comment/CommentForm";
const MovieWatch = () => {
    const { slug, chapter } = useParams();

    const [truyen, setTruyen] = useState("");
    const [check, setCheck] = useState(false);

    const auth = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const [chap, setChap] = useState(1);

    const navigate = useNavigate();

    const { cache, socket, checkToken } = useContext(UserContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug, chapter]);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            if (truyen) {
                if (socket) {
                    socket.emit("watching", {
                        id: truyen?._id,
                    });
                }
            }
        }, 10000);
        return () => {
            clearTimeout(timeOut);
        };
    }, [truyen, socket, chapter]);

    useEffect(() => {
        let here = 1;
        document.addEventListener("keyup", (e) => {
            if (here === 1) {
                if (e.key === "ArrowRight") {
                    if (truyen) {
                        const cha = chapter.split("-")[1] * 1;
                        if (cha * 1 < truyen?.chapters?.length) {
                            navigate(
                                `/truyen-tranh/${slug}/chuong-${cha * 1 + 1}`
                            );
                        }
                    }
                } else if (e.key === "ArrowLeft") {
                    if (truyen) {
                        const cha = chapter.split("-")[1] * 1;
                        if (cha * 1 > 1) {
                            navigate(
                                `/truyen-tranh/${slug}/chuong-${cha * 1 - 1}`
                            );
                        }
                    }
                }
            }
        });
        return () => {
            here = 2;
        };
    }, [slug, chapter, truyen]);

    useEffect(() => {
        let here = true;
        const url = `/api/movie/${slug}`;
        if (cache.current[url]) {
            return setTruyen(cache.current[url]);
        }
        dispatch(isLoading());
        axios
            .get(url)
            .then((res) => {
                dispatch(isSuccess());
                if (!here) {
                    return;
                }
                setTruyen(res?.data?.product);
            })
            .catch((err) => {
                dispatch(isFailing());
                if (here) {
                    setCheck(true);
                    toast.error(err?.response?.data?.msg);
                }
            });
        return () => {
            here = false;
        };
    }, [slug]);

    useEffect(() => {
        const cha = chapter.split("-")[1];
        if (!isNaN(cha)) {
            setChap(cha);
        } else {
            setCheck(true);
        }
    }, [chapter]);

    const getToken = async () => {
        const da = (await checkToken()) || auth.user?.accessToken;
        socket.emit("reading", {
            chapter: chapter,
            id: truyen?._id,
            token: da,
        });
    };

    useEffect(() => {
        if (truyen) {
            if (socket) {
                if (auth.user?.accessToken) {
                    getToken();
                } else {
                    localStorage.getItem("likes").then((res) => {
                        let likesArr = [];
                        if (res !== null) {
                            likesArr = JSON.parse(res);
                        }
                        const check = likesArr.some(
                            (item) =>
                                item?.readId?._id?.toString() ===
                                truyen?._id?.toString()
                        );
                        if (!check) {
                            const newOne = {
                                readId: {
                                    _id: truyen?._id,
                                    image: truyen?.image,
                                    watchs: truyen?.watchs,
                                    stars: truyen?.stars,
                                    reviewers: truyen?.reviewers,
                                    slug: truyen?.slug,
                                    title: truyen?.title,
                                    chapters: [],
                                },
                                chapters: [chapter],
                            };
                            if (truyen?.chapters?.length > 0) {
                                newOne.readId["chapters"] = Array(
                                    truyen?.chapters?.length - 1
                                ).fill(0);
                                newOne.readId["chapters"].push({
                                    createdAt:
                                        truyen?.chapters[
                                            truyen?.chapters?.length - 1
                                        ].createdAt,
                                });
                            }
                            likesArr.push(newOne);
                        } else {
                            likesArr = likesArr.map((item) => {
                                if (
                                    item?.readId?._id?.toString() ===
                                    truyen?._id?.toString()
                                ) {
                                    const check = item?.chapters?.some(
                                        (item) => item === chapter
                                    );
                                    if (!check) {
                                        item?.chapters.push(chapter);
                                    }
                                }
                                return item;
                            });
                        }
                        localStorage.removeItem("likes");
                        localStorage.setItem("likes", JSON.stringify(likesArr));
                    });
                }
            }
        }
    }, [socket, chapter, slug, auth.user, truyen]);

    useEffect(() => {
        if (truyen) {
            if (socket) {
                socket.on("backReading", (infor) => {
                    const user = { ...auth.user };
                    delete user["reads"];
                    if (auth.user) {
                        dispatch(
                            isLogin({
                                ...user,
                                reads: infor.reads,
                            })
                        );
                    }
                });
            }
        }
    }, [socket, chapter, truyen]);
    return (
        <>
            {check ? (
                <NotFound />
            ) : (
                <div className="movie_watch_container">
                    <HelmetProvider>
                        <Helmet>
                            <title>
                                {truyen
                                    ? truyen?.title !== undefined
                                        ? `${truyen?.title} Chương ${chap}`
                                        : "Truyện Tranh Hay"
                                    : "Truyện Tranh Hay"}
                            </title>
                            <link
                                rel="canonical"
                                href={`https://sttruyen.xyz/${slug}/${chapter}`}
                            />
                            <meta
                                property="o:description"
                                content={
                                    truyen
                                        ? truyen?.content
                                            ? truyen?.content
                                            : "Sttruyen là web đọc truyện mọi thể loại."
                                        : "Sttruyen là web đọc truyện mọi thể loại."
                                }
                            />
                        </Helmet>
                    </HelmetProvider>
                    <div className="grid wideS">
                        <div className="movie_watch_title">
                            <div className="card_Detail_navbar_container">
                                <Link
                                    className="card_Detail_navbar_link"
                                    to="/"
                                >
                                    <div>Home</div>
                                </Link>
                                <span>/</span>
                                <Link
                                    className="card_Detail_navbar_link"
                                    to={`/${truyen?.slug}`}
                                >
                                    <div>{truyen?.title}</div>
                                </Link>
                                <span>/</span>
                                <Link
                                    className="card_Detail_navbar_link"
                                    to="/"
                                >
                                    <div>Chương {chap}</div>
                                </Link>
                            </div>
                            <div className="movie_title">
                                <h1>{truyen?.title}</h1>
                            </div>
                            <div className="movie_chapter">
                                <i>Chương {chap}</i>
                            </div>
                            <div className="movie_select_chapter_container">
                                <Link
                                    style={{ textDecoration: "none" }}
                                    to={
                                        chap > 1
                                            ? `/truyen-tranh/${
                                                  truyen?.slug
                                              }/chuong-${chap - 1}`
                                            : "?"
                                    }
                                >
                                    <div className="pre_button">
                                        <i
                                            style={{
                                                fontSize: "1.2rem",
                                                marginRight: "0.5rem",
                                                marginTop: "0.25rem",
                                            }}
                                            className="fa-solid fa-arrow-left"
                                        ></i>
                                        Chương trước
                                    </div>
                                </Link>
                                <select
                                    className="movie_select"
                                    onChange={(e) => {
                                        navigate(
                                            `/truyen-tranh/${truyen?.slug}/${e.target.value}`
                                        );
                                    }}
                                >
                                    {truyen?.chapters?.map((item, index) => {
                                        return chap * 1 === index + 1 ? (
                                            <option
                                                value={`chuong-${index + 1}`}
                                                selected="selected"
                                                key={item?._id + "chapterss"}
                                            >
                                                Chương {index + 1}
                                            </option>
                                        ) : (
                                            <option
                                                value={`chuong-${index + 1}`}
                                                key={item?._id + "chaptersss"}
                                            >
                                                Chương {index + 1}
                                            </option>
                                        );
                                    })}
                                </select>
                                <Link
                                    style={{ textDecoration: "none" }}
                                    to={
                                        chap < truyen?.chapters?.length
                                            ? `/truyen-tranh/${
                                                  truyen?.slug
                                              }/chuong-${chap * 1 + 1}`
                                            : "?"
                                    }
                                >
                                    <div className="pre_button">
                                        Chương sau
                                        <i
                                            style={{
                                                fontSize: "1.2rem",
                                                marginLeft: "0.5rem",
                                                marginTop: "0.25rem",
                                            }}
                                            className="fa-solid fa-arrow-right"
                                        ></i>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="movie_watch_image_container">
                            {truyen &&
                                truyen?.chapters[chap - 1]?.images?.map(
                                    (item) => (
                                        <ImageWatch
                                            key={item + "as"}
                                            url={item}
                                        />
                                    )
                                )}
                        </div>
                        <div className="movie_watch_comment_container">
                            <CommentForm chapter={chap} />
                        </div>
                    </div>
                    <div className="chapter_next_slice">
                        <Link
                            className="chapter_next_button"
                            to={
                                chap > 1
                                    ? `/truyen-tranh/${truyen?.slug}/chuong-${
                                          chap - 1
                                      }`
                                    : "?"
                            }
                        >
                            <div className="chapter_next_button_items">
                                <i className="fa-solid fa-angles-left"></i>
                            </div>
                        </Link>
                        <select
                            onChange={(e) => {
                                navigate(
                                    `/truyen-tranh/${truyen?.slug}/${e.target.value}`
                                );
                            }}
                        >
                            {truyen?.chapters?.map((item, index) => {
                                return chap * 1 === index + 1 ? (
                                    <option
                                        value={`chuong-${index + 1}`}
                                        selected="selected"
                                        key={item?._id + "chapterss"}
                                    >
                                        Chương {index + 1}
                                    </option>
                                ) : (
                                    <option
                                        value={`chuong-${index + 1}`}
                                        key={item?._id + "chaptersss"}
                                    >
                                        Chương {index + 1}
                                    </option>
                                );
                            })}
                        </select>
                        <Link
                            className="chapter_next_button"
                            to={
                                chap < truyen?.chapters?.length
                                    ? `/truyen-tranh/${truyen?.slug}/chuong-${
                                          chap * 1 + 1
                                      }`
                                    : "?"
                            }
                        >
                            <div className="chapter_next_button_items">
                                <i className="fa-solid fa-angles-right"></i>
                            </div>
                        </Link>
                    </div>
                    <ScrollTop />
                </div>
            )}
        </>
    );
};

export default MovieWatch;
