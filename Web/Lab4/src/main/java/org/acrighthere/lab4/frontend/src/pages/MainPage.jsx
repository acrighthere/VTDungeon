import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CoordInputs from "../components/CoordInputs";
import CoordinatePlane from "../components/CoordinatePlane";
import CheckButton from "../components/Buttons/CheckButton";
import ClearButton from "../components/Buttons/ClearButton";
import LogoutButton from "../components/Buttons/LogoutButton";
import ResultsTable from "../components/ResultsTable";
import Pagination from "../components/Pagination";

import { fetchPoints, sendPoint, setPage } from "../store/pointsSlice";
import "../styles/MainPage.css";

export default function MainPage({ onLogout }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const coords = useSelector(state => state.coords);
    const { items: points, currentPage, totalPages, pageSize } =
        useSelector(state => state.points);

    useEffect(() => {
        const handleStorage = e => {
            if (e.key === "accessToken" && !e.newValue) {
                navigate("/login", { replace: true });
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [navigate]);

    useEffect(() => {
        dispatch(fetchPoints({ page: currentPage, size: pageSize }));
    }, [dispatch, currentPage, pageSize]);

    const handlePageChange = page => {
        dispatch(setPage(page));
    };

    const handleCanvasClick = (x, y, r) => {
        dispatch(sendPoint({ x, y, r }))
            .unwrap()
            .then(() => {
                dispatch(setPage(0));
                dispatch(fetchPoints({ page: 0, size: pageSize }));
            });
    };

    return (
        <div className="main-page">
            <div className="main-card">
                <CoordInputs />

                <CoordinatePlane
                    r={coords.r}
                    points={points}
                    onCanvasClick={handleCanvasClick}
                />

                <div className="buttons-row">
                    <CheckButton />
                    <ClearButton />
                    <LogoutButton onLogout={onLogout} />
                </div>

                <ResultsTable points={points} />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
