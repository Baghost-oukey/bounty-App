import TextArea from "./components/textArea";
import GridCardArea from "./components/gridCard";

export function Dashboard() {
  return (
    <div className="w-full py-10 flex flex-col gap-6">
      {/* Centered Address Input Section */}
      <div className="w-full flex justify-center">
        <TextArea />
      </div>

      {/* Grid of Cards Section */}
      <div className="w-full">
        <GridCardArea />
      </div>
    </div>
  );
}

export default Dashboard;