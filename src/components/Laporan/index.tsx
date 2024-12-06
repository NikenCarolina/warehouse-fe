import { Report } from "@/interfaces/report.interface";
import { ApiResponse } from "@/interfaces/response.interface";
import { get } from "@/utils/fetch";
import { useEffect, useState } from "react";

const Laporan = () => {
  const [reports, setReports] = useState<Report[]>();
  const getReport = async () => {
    const response = await get<ApiResponse<Report[]>>("/reports");
    setReports(response.data);
  };
  useEffect(() => {
    getReport();
  }, []);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Gudang</th>
            <th>Nama Barang</th>
            <th>Stok Dus</th>
            <th>Stok Pcs</th>
          </tr>
        </thead>
        <tbody>
          {reports != undefined &&
            reports.map((item, index) => (
              <tr key={index}>
                <td>{item.warehouse.name}</td>
                <td>{item.product.name}</td>
                <td>{item.dus_stock}</td>
                <td>{item.pcs_stock}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};
export default Laporan;
