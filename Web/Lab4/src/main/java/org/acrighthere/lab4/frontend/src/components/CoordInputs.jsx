import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import XSelector from "./XSelector";
import YInput from "./YInput";
import RSelector from "./RSelector";
import { setCoords } from "../store/coordsSlice";

export default function CoordInputs() {
    const dispatch = useDispatch();
    const coords = useSelector(state => state.coords);
    const user = useSelector(state => state.auth.user);

    const [x, setX] = useState(coords.x ?? null);
    const [y, setY] = useState(coords.y ?? "");
    const [r, setR] = useState(coords.r ?? null);
    const [yError, setYError] = useState(null);

    useEffect(() => {
        setX(null);
        setY("");
        setR(null);
    }, [user]);


    useEffect(() => {
        if (y === "" || y === null) {
            setYError(null);
        } else {
            const num = parseFloat(String(y).replace(",", "."));
            setYError(num < -3 || num > 5 || isNaN(num) ? "Y должен быть числом от -3 до 5" : null);
        }
    }, [y]);

    useEffect(() => {
        const yVal = y === "" || y === null ? null : parseFloat(String(y).replace(",", "."));
        if (yError === null) {
            dispatch(setCoords({ x, y: yVal, r }));
        }
    }, [x, y, r, yError, dispatch]);

    return (
        <div className="coord-inputs">
            <XSelector value={x} onChange={setX} />
            <YInput value={y} onChange={setY} error={yError} />
            <RSelector value={r} onChange={setR} />
        </div>
    );
}
