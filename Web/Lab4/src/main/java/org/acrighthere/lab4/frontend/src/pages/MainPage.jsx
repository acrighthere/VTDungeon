import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CoordInputs from "../components/CoordInputs";
import CoordinatePlane from "../components/CoordinatePlane";
import CheckButton from "../components/Buttons/CheckButton";
import ClearButton from "../components/Buttons/ClearButton";
import LogoutButton from "../components/Buttons/LogoutButton";
import ResultsTable from "../components/ResultsTable";

import {fetchPoints, sendPoint} from "../store/pointsSlice";
import { setCoordsFromCanvas } from "../store/coordsSlice";

import '../styles/MainPage.css';
import Pagination from "../components/Pagination";

export default function MainPage({ onLogout }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const coords = useSelector(state => state.coords);
    const points = useSelector(state => state.points.items);

    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === "accessToken" && !e.newValue) {
                navigate("/login", { replace: true });
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [navigate]);

    useEffect(() => {
        dispatch(fetchPoints());
    }, [dispatch]);

    return (
        <div className="main-page">
            <div className="main-card">
                <CoordInputs />
                <CoordinatePlane
                    r={coords.r}
                    points={points}
                    onCanvasClick={(x, y, r) => {
                        dispatch(sendPoint({ x, y, r }));
                    }}
                />
                <div className="buttons-row">
                    <CheckButton />
                    <ClearButton />
                    <LogoutButton onLogout={onLogout} />
                </div>
                <ResultsTable points={points} />
                <Pagination />
            </div>
        </div>
    );
}
