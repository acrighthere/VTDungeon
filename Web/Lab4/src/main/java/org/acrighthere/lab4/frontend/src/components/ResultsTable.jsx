export default function ResultsTable({ points }) {
    return (
        <table border="1" cellPadding="6">
            <thead>
            <tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Попадание</th>
                <th>Время отправки</th>
                <th>Время исполнения (мс)</th>
                <th>Владелец</th>
            </tr>
            </thead>
            <tbody>
            {points.map(p => (
                <tr key={p.id}>
                    <td>{p.x}</td>
                    <td>{p.y}</td>
                    <td>{p.r}</td>
                    <td>{p.hit ? "Да" : "Нет"}</td>
                    <td>{p.createdAt}</td>
                    <td>{p.executionTime}</td>
                    <td>{p.owner}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}