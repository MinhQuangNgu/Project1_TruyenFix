import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import usePaginating from "./usePaginating";

const Paginating = ({ count, limit, updatePS }) => {
    const {
        prev,
        next,
        jump,
        firstArr,
        lastArr,
        activePage,
        page,
        setUpdateP,
        updateP,
    } = usePaginating({
        count: count || 20,
        limit: limit || 20,
    });
    const { search } = useLocation();

    useEffect(() => {
        setUpdateP(!updateP);
    }, [updatePS]);

    const navigate = useNavigate();

    useEffect(() => {
        const searching = {
            sort: new URLSearchParams(search).get("sort") || "",
            kind: new URLSearchParams(search).get("kind") || "",
            country: new URLSearchParams(search).get("country") || "",
            type: new URLSearchParams(search).get("type") || "",
            searching: new URLSearchParams(search).get("searching") || "",
            page: page,
        };

        const excludesFields = ["sort", "type", "country", "searching", "kind"];

        excludesFields.forEach((item) => {
            if (!searching[item]) {
                delete searching[item];
            }
        });

        if (searching["page"] === 1) {
            delete searching["page"];
        }

        navigate(`?${new URLSearchParams(searching)}`);
    }, [page]);

    return (
        <div className="paginating_container">
            <div onClick={prev} className="paginating-items-next">
                <i className="fa-solid fa-chevron-left"></i>
            </div>
            {firstArr.map((item) => (
                <div
                    key={item + "first"}
                    onClick={() => jump(item)}
                    className={`paginating-items ${activePage(item)}`}
                >
                    {item}
                </div>
            ))}
            {lastArr.length !== 0 && (
                <div className={`paginating-items`}>...</div>
            )}
            {lastArr.map((item) => (
                <div
                    key={item + "last"}
                    onClick={() => jump(item)}
                    className={`paginating-items ${activePage(item)}`}
                >
                    {item}
                </div>
            ))}
            <div onClick={next} className="paginating-items-next">
                <i className="fa-solid fa-chevron-right"></i>
            </div>
        </div>
    );
};

export default Paginating;
