import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import Card from "../card/Card";
import Paginating from "../paginating/Paginating";
import { isFailing, isLoading, isSuccess } from "../redux/slice/auth";
import "./style.css";
const Search = () => {
    const { search } = useLocation();
    const [movies, setMovies] = useState({});
    const dispatch = useDispatch();
    const [kinds, setKinds] = useState([]);
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    const [updatePS, setUpdatePS] = useState(false);

    const countRef = useRef(1);

    const sortRef = useRef();
    const kindRef = useRef();
    const countryRef = useRef();

    const { cache } = useContext(UserContext);

    const handleSearching = () => {
        const searchingI = new URLSearchParams(search).get("searching") || "";
        const searchForm = {
            sort: sortRef.current?.value,
            kind: kindRef.current?.value,
            country: countryRef.current?.value,
            searching: searchingI,
        };

        const excludesFields = ["sort", "kind", "country", "searching"];
        excludesFields.forEach((item) => {
            if (!searchForm[item]) {
                delete searchForm[item];
            }
        });

        const searching = new URLSearchParams(searchForm).toString();
        setUpdatePS(!updatePS);
        navigate(`?${searching}`);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [search]);

    useEffect(() => {
        const apiPoints = ["/api/kind", "/api/country"];
        if (cache.current[apiPoints[0]] && cache.current[apiPoints[1]]) {
            setKinds(cache.current[apiPoints[0]]);
            return setCountries(cache.current[apiPoints[1]]);
        } else if (cache.current[apiPoints[1]]) {
            return setCountries(cache.current[apiPoints[1]]);
        } else if (cache.current[apiPoints[0]]) {
            return setKinds(cache.current[apiPoints[0]]);
        }
    }, [cache.current["/api/kind"], cache.current["/api/country"]]);

    useEffect(() => {
        const url = search
            ? `/api/movie${search}&limit=20`
            : `/api/movie?limit=20`;
        if (cache.current[url]) {
            setMovies(cache.current[url]);
            countRef.current = cache.current[url]?.count;
            return;
        }
        dispatch(isLoading());
        axios
            .get(url)
            .then((res) => {
                dispatch(isSuccess());
                setMovies(res.data);
                res.data?.Products?.forEach((item) => {
                    let urlChapter = `/api/movie/${item?.slug}`;
                    if (!cache.current[urlChapter]) {
                        cache.current[urlChapter] = item;
                    }
                });
                cache.current[url] = res.data;
                countRef.current = res.data?.count;
            })
            .catch(() => {
                dispatch(isFailing());
            });
    }, [search]);

    return (
        <div className="search_container">
            <HelmetProvider>
                <Helmet>
                    <title>Tìm Kiếm Phim</title>
                    <link rel="canonical" href="https//stphim.xyz/tim-kiem" />
                    <meta
                        property="o:description"
                        content="Stphim là web đọc truyện mọi thể loại, chúng tôi hy vọng rằng bạn sẽ có 1 buổi đọc truyện thật tuyệt vời."
                    />
                </Helmet>
            </HelmetProvider>
            <div className="grid wideS">
                <div className="search_filter_container">
                    <select
                        ref={sortRef}
                        name="sort"
                        className="search_filter-select"
                    >
                        <option value="">Truyện mới</option>
                        <option value="createdAt">Truyện cũ</option>
                        <option value="-watchs">Xem nhiều nhất</option>
                        <option value="watchs">Xem ít nhất</option>
                    </select>
                    <select
                        ref={kindRef}
                        name="the-loai"
                        className="search_filter-select"
                    >
                        <option value="">Thể Loại</option>
                        {kinds?.map((item) => (
                            <option
                                value={item?.slug}
                                key={item?._id + "kinds"}
                            >
                                {item?.name}
                            </option>
                        ))}
                    </select>
                    <select
                        ref={countryRef}
                        name="quoc-gia"
                        className="search_filter-select"
                    >
                        <option value="">Quốc gia</option>
                        {countries?.map((item) => (
                            <option
                                value={item?.slug}
                                key={item?._id + "kinds"}
                            >
                                {item?.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleSearching} className="search_button">
                        Tìm Kiếm
                    </button>
                </div>
                <div className="search_items_container">
                    {movies?.Products?.length == 0 ? (
                        <div className="warning_movies">
                            Không có phim bạn muốn tìm.
                        </div>
                    ) : (
                        <div className="row">
                            {movies?.Products?.map((item) => (
                                <div
                                    key={item?._id + "Searching"}
                                    className="col c-6 m-4 l-2-4"
                                >
                                    <Card item={item} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Paginating
                updatePS={updatePS}
                limit={20}
                count={countRef.current}
            />
        </div>
    );
};

export default Search;
