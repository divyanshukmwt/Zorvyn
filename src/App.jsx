import Badge from "./components/ui/Badge";
import Toast from "./components/ui/Toast";
import ExportMenu from "./components/ui/ExportMenu";

export default function App() {
  return (
    <div className="p-5 space-y-4">
      <Badge text="Income" />
      <ExportMenu />
      <Toast />
    </div>
  );
}