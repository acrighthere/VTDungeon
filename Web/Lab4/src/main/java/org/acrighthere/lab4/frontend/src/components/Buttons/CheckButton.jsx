import { useDispatch, useSelector } from "react-redux";
import { sendPoint, fetchPoints, setPage } from "../../store/pointsSlice";

export default function CheckButton() {
    const dispatch = useDispatch();
    const { x, y, r } = useSelector(state => state.coords);
    const { loading, pageSize } = useSelector(state => state.points);

    const isValid = x !== null && y !== null && r !== null && r > 0;

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
            disabled={loading ||!isValid}
            onClick={handleClick}
        >
            {loading ? "Проверяю..." : "Проверить точку"}
        </button>
    );
}
