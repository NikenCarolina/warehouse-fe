import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") navigate("penerimaan");
  }, [navigate]);

  return (
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link to="/penerimaan">Penerimaan Barang</Link>
          <Link to="/pengambilan">Pengambilan Barang</Link>
          <Link to="/laporan">Laporan Stok</Link>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default UserLayout;
