import { Link } from "react-router-dom";
import {NON_TEACHER} from "../../constants";

export function EmployeeAction({ row }) {
  const pageUserType =
    row.user_type === NON_TEACHER ? "non-teachers" : "teachers";

  return (
    <div className="cellAction">
      <Link
        to={`/${pageUserType}/${row.admin_location_id}/${row.employee_no}`}
        style={{ textDecoration: "none" }}
      >
        <div className="viewButton">View</div>
      </Link>
    </div>
  );
}
