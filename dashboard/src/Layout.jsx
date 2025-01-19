import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <main className="bg-slate-100 pt-5 md:pt-10">
        <div className="mx-auto max-w-2xl px-4">
          <Outlet />
        </div>
      </main>
    </>
  );
}