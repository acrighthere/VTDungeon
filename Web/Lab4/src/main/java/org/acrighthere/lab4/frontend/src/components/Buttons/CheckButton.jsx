import { useDispatch, useSelector } from "react-redux";
import { sendPoint, fetchPoints, setPage } from "../../store/pointsSlice";

export default function CheckButton() {
    const dispatch = useDispatch();
    const { x, y, r } = useSelector(state => state.coords);
    const { loading, pageSize } = useSelector(state => state.points);

    const handleClick = () => {
        dispatch(sendPoint({ x, y, r }))
            .unwrap()
            .then(() => {
                dispatch(setPage(0));
                dispatch(fetchPoints({ page: 0, size: pageSize }));
            });
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
