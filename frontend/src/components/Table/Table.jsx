import './Table.css';

export default function Table({ columns, data = [], emptyMessage }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {!hasData && (
            <tr>
              <td colSpan={columns.length} className="empty-cell">
                {emptyMessage || 'Nenhum registro encontrado.'}
              </td>
            </tr>
          )}

          {hasData &&
            data.map((row, rowIndex) => (
              <tr key={row.id || `${rowIndex}-${JSON.stringify(row)}`}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
