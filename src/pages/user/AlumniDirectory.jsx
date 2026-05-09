import Directory from "./Directory.jsx";
import { ALUMNI_CATEGORIES } from "../../lib/constants";

export default function AlumniDirectory() {
  return <Directory type="alumni" title="Alumni Directory"
    filterOptions={ALUMNI_CATEGORIES} filterField="classification" />;
}
