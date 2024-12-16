import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { RiArrowDropDownLine } from "react-icons/ri";
import Loader from "./components/Loader";
import { InputNumber } from "primereact/inputnumber";

const App = () => {
  type Product = {
    id: number;
    title: string;
    description: string;
    origin?: string;
    inscriptions?: string;
    date_start?: string;
    date_end?: string;
  };
  const [product, setProduct] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [rows, setRows] = useState<number>(12);
  const [TotalPage, setTotalPage] = useState<number>();
  const [CurrentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [Sortnum, setSortnum] = useState<number>(0);
  const [prevNumber, setprevNumber] = useState<number>(0);
  // console.log(selectedProducts);
  const op = useRef<OverlayPanel | null>(null);
  const previousPageRef = useRef<number>(CurrentPage);

  // Fetching Data
  const FetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${CurrentPage}`
      );
      if (response && response.data) {
        const FetchProduct = response.data.data.map((item: any) => ({
          id: item.id,
          title: item.title || "Untitled",
          origin: item.place_of_origin || "Unknown",
          description: item.artist_display || "No description",
          inscriptions: item.inscriptions || "null",
          date_start: item.date_start || "",
          date_end: item.date_end || "",
        }));

        setProduct(FetchProduct);
        setTotalPage(response.data.pagination.total || 0);
        console.log(response.data.data);
      } else {
        console.log("No response or data available");
      }
    } catch (error) {
      console.log("Error Occupied While fetching API", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    FetchData();
    if (previousPageRef.current !== CurrentPage) {
      const totalpage: number = Math.ceil(prevNumber / rows);

      if (CurrentPage > previousPageRef.current) {
        if (totalpage != 0) {
          setSortnum((prev) => Math.max(0, prev - rows));
        }
      } else if (CurrentPage < previousPageRef.current) {
        if (totalpage != 0) {
          setSortnum((prev) =>
            prevNumber === 0 ? prev : prev + (rows - prevNumber)
          );
          setprevNumber(-12);
        }
      }
    }
    previousPageRef.current = CurrentPage;
  }, [CurrentPage]);

  useEffect(() => {
    if(Sortnum > 0){
      const preselectedRows = product.slice(0, Sortnum);
      setSelectedProducts(preselectedRows);
    }
    
  }, [product, Sortnum, CurrentPage]);
  const onPageChange = (event: any) => {
    const currentPage = event.page + 1; // Update the current page (1-based index)
    const rowsPerPage = event.rows; // Rows per page

    // Update the state
    setCurrentPage(currentPage);
    setRows(rowsPerPage);
  };

  const handleRowSelection = () => {
    setprevNumber(Sortnum);
    const preselectedRows = product.slice(0, Sortnum);
    setSelectedProducts(preselectedRows);
    op.current?.hide();
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className="card">
        <DataTable
          value={product}
          selection={selectedProducts}
          onSelectionChange={(e: any) => {
            setSelectedProducts(e.value);
            if (Sortnum > 12) {
              setSortnum(0);
            }
          }}
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>

          <Column
            header={
              <Button
                icon={<RiArrowDropDownLine size={100} />}
                severity="secondary"
                text
                style={{ height: 12 }}
                onClick={(e) => op.current?.toggle(e)}
              />
            }
          ></Column>
          <Column field="title" header="Title"></Column>
          <Column field="origin" header="Origin"></Column>
          <Column
            field="description"
            header="Description"
            style={{ width: "40%", textOverflow: "ellipsis" }}
          ></Column>
          <Column field="inscriptions" header="Inscription"></Column>
          <Column field="date_start" header="Date start"></Column>
          <Column field="date_end" header="Date end"></Column>
        </DataTable>
        <OverlayPanel style={{ zIndex: 999 }} ref={op}>
          <InputNumber
            placeholder="Select rows..."
            onValueChange={(e) => setSortnum(e.value || 0)}
          />
          <Button
            style={{ marginLeft: 10 }}
            label="Submit"
            severity="secondary"
            text
            raised
            onClick={handleRowSelection}
          />
        </OverlayPanel>
        <Paginator
          first={(CurrentPage - 1) * rows}
          rows={rows}
          totalRecords={TotalPage}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default App;
