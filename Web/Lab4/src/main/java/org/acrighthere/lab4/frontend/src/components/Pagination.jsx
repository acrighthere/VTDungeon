import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPage } from "../store/pointsSlice";

export default function Pagination() {
    const dispatch = useDispatch();
    const { items, currentPage, pageSize } = useSelector(state => state.points);
    const totalPages = Math.ceil(items.length / pageSize);

    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button
                onClick={() => dispatch(setPage(Math.max(currentPage - 1, 1)))}
                disabled={currentPage === 1}
            >
                Назад
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    onClick={() => dispatch(setPage(i + 1))}
                    className={currentPage === i + 1 ? "active" : ""}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={() => dispatch(setPage(Math.min(currentPage + 1, totalPages)))}
                disabled={currentPage === totalPages}
            >
                Вперёд
            </button>
        </div>
    );
}
