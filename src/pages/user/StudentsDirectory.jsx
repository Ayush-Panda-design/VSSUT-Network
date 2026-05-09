import Directory from "./Directory.jsx";

import {
  STUDENT_YEARS,
} from "../../lib/constants";

export default function StudentsDirectory() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Directory
        type="student"
        title="Students Directory"
        filterOptions={STUDENT_YEARS}
        filterField="year"
      />
    </div>
  );
}