import React, { useState } from "react";
import { DataGrid, GridColumns } from "@material-ui/data-grid";

const columns = [
  { field: "blockHeight", headerName: "Block", width: 150, sortable: true },
  { field: "blockTime", headerName: "Date", width: 250, sortable: true },
  { field: "change", headerName: "Change", width: 150, sortable: true },
  { field: "reason", headerName: "Reason", width: 400, sortable: true },
  { field: "valueAfter", headerName: "Pool", width: 150, sortable: true },
  { field: "rateAfter", headerName: "Price", width: 150, sortable: true },
  { field: "issuance", headerName: "Issuance", width: 150, sortable: true },
];

const DollarPoolGrid = (props: { dollarPoolChanges: DollarPoolChange[] }) => {
  const { dollarPoolChanges } = props;
  const [page, setPage] = useState(1);
  if (!dollarPoolChanges.length) return <div />;

  return (
    <div style={{ height: 800, position: "relative" }}>
      <DataGrid
        rows={dollarPoolChanges}
        columns={(columns as unknown) as GridColumns}
        rowCount={dollarPoolChanges.length}
        disableSelectionOnClick
      />
    </div>
  );
};

export default DollarPoolGrid;
