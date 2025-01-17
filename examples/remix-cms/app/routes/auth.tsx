import { Outlet } from "react-router";

export default function Auth() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <Outlet />
    </div>
  );
}
