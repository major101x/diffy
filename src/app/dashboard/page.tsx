import { fetchData } from "../lib/actions";
import { Menu } from "./components/menu";

export default function Dashboard() {
  async function handleInstallClick() {
    "use server";
    fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/install`);
  }
  return (
    <div className="px-3">
      <Menu handleInstallClick={handleInstallClick} />
    </div>
  );
}
