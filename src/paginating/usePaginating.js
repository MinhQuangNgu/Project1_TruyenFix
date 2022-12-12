import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const usePaginating = ({ count, limit }) => {
    const numberOfPage = Math.ceil(count / limit);

    const [page, setPage] = useState(1);
    const [firstArr, setFirstArr] = useState([]);
    const [lastArr, setLastArr] = useState([]);

    const [updateP, setUpdateP] = useState(false);

    const { search } = useLocation();

    useEffect(() => {
        const newArr = [...Array(numberOfPage)].map((item, index) => index + 1);
        if (numberOfPage >= 4) {
            if (page + 2 <= numberOfPage - 1) {
                const arr = newArr.slice(page - 1, page + 2);
                setFirstArr(arr);
                const las = newArr.slice(numberOfPage - 1);
                setLastArr(las);
            } else {
                const arr = newArr.slice(numberOfPage - 4);
                setFirstArr(arr);
                setLastArr([]);
            }
        } else {
            setFirstArr(newArr);
            setLastArr([]);
        }
    }, [page, search, count, limit]);

    useEffect(() => {
        setPage(1);
    }, [updateP]);

    const prev = () => {
        setPage(Math.max(page - 1, 1));
    };

    const nex = () => {
        setPage(Math.min(page + 1, numberOfPage));
    };

    const jump = (e) => {
        setPage(e);
    };

    const activePage = (e) => {
        return e === page ? "active" : "";
    };

    return {
        page,
        setPage,
        firstArr,
        lastArr,
        jump,
        activePage,
        nex,
        prev,
        setUpdateP,
        updateP,
    };
};

export default usePaginating;
