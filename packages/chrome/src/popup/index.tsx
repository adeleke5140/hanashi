import { createRoot } from "react-dom/client";
import Popup from "./popup";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<Popup />);
