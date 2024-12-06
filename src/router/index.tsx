import { createBrowserRouter } from "react-router-dom";
import FormPenerimaanBarang from "@/components/FormPenerimaanBarang";
import FormPengambilanBarang from "@/components/FormPengambilanBarang";
import Laporan from "@/components/Laporan";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "penerimaan",
        element: <FormPenerimaanBarang />,
      },
      {
        path: "pengambilan",
        element: <FormPengambilanBarang />,
      },
      {
        path: "laporan",
        element: <Laporan />,
      },
    ],
  },
]);

export default router;
