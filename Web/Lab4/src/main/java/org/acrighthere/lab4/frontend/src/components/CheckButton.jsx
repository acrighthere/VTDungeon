import { useDispatch, useSelector } from "react-redux";
import { sendPoint } from "../store/pointsSlice";

export default function CheckButton() {
    const dispatch = useDispatch();
    const { x, y, r } = useSelector(state => state.coords);
    const loading = useSelector(state => state.points.loading);

    const handleClick = () => {
        dispatch(sendPoint({ x, y, r }));
    };

    return (
        <button
            disabled={loading || x === null || y === null || r === null}
            onClick={handleClick}
        >
            {loading ? "Проверяю..." : "Проверить точку"}
        </button>
    );
}
