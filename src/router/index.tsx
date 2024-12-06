import { createBrowserRouter } from "react-router-dom";
import FormPenerimaanBarang from "@/components/FormPenerimaanBarang";
import FormPengambilanBarang from "@/components/FormPengambilanBarang";
import Laporan from "@/components/Laporan";
import UserLayout from "@/layouts/UserLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
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
