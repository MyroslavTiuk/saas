import { Link } from "react-router-dom";

export function ArchiveEmployeeAction({ row }) {
  return (
    <div className="cellAction">
      <Link
        to={`/archive/view/${row.employee_no}`}
        style={{ textDecoration: "none" }}
      >
        <div className="viewButton">View</div>
      </Link>
    </div>
  );
}
