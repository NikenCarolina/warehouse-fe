import { useCallback, useState } from "react";
import { Item, SubmittedItem } from "../../interfaces/item.interface";
import { get, post } from "../../utils/fetch";
import React from "react";
import { debounce } from "@/utils/debounce";
import { Warehouse } from "@/interfaces/warehouse.interface";
import { Product } from "@/interfaces/product.interface";
import { Supplier } from "@/interfaces/supplier.interface";
import { ApiResponse } from "@/interfaces/response.interface";

const FormPenerimaanBarang: React.FC = () => {
  const [error, setError] = useState<string>("");

  const [note, setNote] = useState<string>("");

  const [itemOptions, setItemOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [warehouseOptions, setWarehouseOptions] = useState<Warehouse[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<Supplier[]>([]);

  const [isFetching, setIsFetching] = useState(false);
  const [isWarehouseFetching, setIsWarehouseFetching] = useState(false);
  const [isSupplierFetching, setIsSupplierFetching] = useState(false);

  const [isFocus, setIsFocus] = useState(-1);
  const [isWarehouseFocus, setIsWarehouseFocus] = useState(false);
  const [isSupplierFocus, setIsSupplierFocus] = useState(false);

  const [warehouse, setWarehouse] = useState<Warehouse>();
  const [warehouseInput, setWarehouseInput] = useState<string>("");

  const [supplier, setSupplier] = useState<Supplier>();
  const [supplierInput, setSupplierInput] = useState<string>("");

  const [items, setItems] = useState<Item[]>([
    {
      id: "",
      name: "",
      dus: "",
      pcs: "",
    },
  ]);

  const addNewRow = () => {
    const newRow = {
      id: "",
      name: "",
      dus: "",
      pcs: "",
    };
    setItems((prevData) => [...prevData, newRow]);
  };
  const removeRow = (index: number) => {
    setItems((prevData) => prevData.filter((_, i) => i !== index));
  };

  const fetchItemOptions = useCallback(
    debounce(async (inputValue: string) => {
      setIsFetching(true);
      try {
        const response = await get<ApiResponse<Product[]>>(
          "/products?name=" + inputValue
        );
        setItemOptions(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsFetching(false);
      }
    }, 1000),
    []
  );

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedRows = [...items];
    updatedRows[index][field as keyof Item] = value;
    setItems(updatedRows);
  };

  const handleProductSearch = (index: number, inputValue: string) => {
    handleItemChange(index, "name", inputValue);
    handleItemChange(index, "id", "");
    fetchItemOptions(inputValue);
  };

  const fetchWarehouse = useCallback(
    debounce(async (inputValue: string) => {
      setIsWarehouseFetching(true);
      try {
        const response = await get<ApiResponse<Warehouse[]>>(
          "/warehouses?name=" + inputValue
        );
        setWarehouseOptions(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsWarehouseFetching(false);
      }
    }, 1000),
    []
  );

  const handleWarehouseSearch = (inputValue: string) => {
    setWarehouseInput(inputValue);
    fetchWarehouse(inputValue);
  };

  const fetchSupplier = useCallback(
    debounce(async (inputValue: string) => {
      setIsSupplierFetching(true);
      try {
        const response = await get<ApiResponse<Supplier[]>>(
          "/suppliers?name=" + inputValue
        );
        setSupplierOptions(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsSupplierFetching(false);
      }
    }, 1000),
    []
  );

  const handleSupplierSearch = (inputValue: string) => {
    setSupplierInput(inputValue);
    fetchSupplier(inputValue);
  };

  const handleSubmit = async () => {
    if (supplier === undefined) {
      setError("Nama supplier harus diisi");
      return;
    }
    if (warehouse === undefined) {
      setError("Nama gudang harus diisi");
      return;
    }
    const submittedItem: SubmittedItem[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].name.trim() === "" || items[i].id <= 0) {
        setError("Nama barang harus diisi");
        return;
      }
      if (items[i].dus === "") {
        setError("Jumlah dus harus diisi");
        return;
      }
      if (items[i].pcs === "") {
        setError("Jumlah dus harus diisi");
        return;
      }
      submittedItem.push({
        id: items[i].id,
        name: items[i].name,
        dus: Number(items[i].dus),
        pcs: Number(items[i].pcs),
      });
    }
    await post(`/warehouses/${warehouse.id}/items/in`, {
      date: new Date(),
      items: submittedItem,
      warehouse: warehouse,
      supplier: supplier,
    });
  };

  return (
    <>
      <h2>Formulir Penerimaan Barang</h2>
      <label>Nama Supplier</label>
      <input
        type="text"
        value={supplierInput}
        onChange={(e) => handleSupplierSearch(e.target.value)}
        onFocus={() => {
          setIsSupplierFocus(true);
          handleSupplierSearch("");
        }}
        onBlur={() => {
          if (supplier === undefined) setSupplierInput("");
          setTimeout(() => setIsSupplierFocus(false), 250);
        }}
        placeholder="Supplier A"
      />
      <ul>
        {isSupplierFetching && isSupplierFocus && <li>Loading...</li>}
        {!isSupplierFetching &&
          isSupplierFocus &&
          supplierOptions.map((option) => (
            <li
              key={option.id}
              onClick={() => {
                setIsSupplierFocus(false);
                setSupplier(option);
                setSupplierInput(option.name);
              }}
              style={{
                listStyle: "none",
                padding: "5px",
                cursor: "pointer",
              }}
            >
              {option.name}
            </li>
          ))}
      </ul>
      <label>Nama Gudang</label>
      <input
        type="text"
        value={warehouseInput}
        onChange={(e) => handleWarehouseSearch(e.target.value)}
        onFocus={() => {
          setIsWarehouseFocus(true);
          handleWarehouseSearch("");
        }}
        onBlur={() => {
          if (warehouse === undefined) setWarehouseInput("");

          setTimeout(() => setIsWarehouseFocus(false), 250);
        }}
        placeholder="Gudang A"
      />
      <ul>
        {isWarehouseFetching && isWarehouseFocus && <li>Loading...</li>}
        {!isWarehouseFetching &&
          isWarehouseFocus &&
          warehouseOptions.map((option) => (
            <li
              key={option.id}
              onClick={() => {
                setIsWarehouseFocus(false);
                setWarehouse(option);
                setWarehouseInput(option.name);
              }}
              style={{
                listStyle: "none",
                padding: "5px",
                cursor: "pointer",
              }}
            >
              {option.name}
            </li>
          ))}
      </ul>
      <button onClick={addNewRow}>Tambah Barang</button>
      <table>
        <thead>
          <tr>
            <th>Nama Barang</th>
            <th>Dus</th>
            <th>Pcs</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => handleProductSearch(index, e.target.value)}
                  onFocus={() => setIsFocus(index)}
                  onBlur={() => {
                    if (row.id.length === 0)
                      handleItemChange(index, "name", "");
                    setTimeout(() => setIsFocus(-1), 250);
                  }}
                  placeholder={`Nama Barang`}
                />
                <ul>
                  {isFetching && isFocus === index && <li>Loading...</li>}
                  {!isFetching &&
                    isFocus === index &&
                    itemOptions.map((option) => (
                      <li
                        key={option.id}
                        onClick={() => {
                          handleItemChange(index, "name", option.name);
                          handleItemChange(index, "id", option.id);
                          setIsFocus(-1);
                        }}
                        style={{
                          listStyle: "none",
                          padding: "5px",
                          cursor: "pointer",
                        }}
                      >
                        {option.name}
                      </li>
                    ))}
                </ul>
              </td>
              <td>
                <input
                  type="number"
                  value={row.dus}
                  onChange={(e) =>
                    handleItemChange(index, "dus", e.target.value)
                  }
                  placeholder={`1 Dus`}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.pcs}
                  onChange={(e) =>
                    handleItemChange(index, "pcs", e.target.value)
                  }
                  placeholder={`1 Pcs`}
                />
              </td>
              <td>
                <button onClick={() => removeRow(index)}>Hapus Barang</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <label>Note</label>
      <input value={note} onChange={(e) => setNote(e.target.value)}></input>
      <p>{error}</p>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
};

export default FormPenerimaanBarang;
