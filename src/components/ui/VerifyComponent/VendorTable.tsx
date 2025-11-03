import React from "react";

// Vendor data array
const vendorsData = [
  { id: 1234, vendorName: "Luxury Fashion Hub", reports: 23 },
  { id: 1235, vendorName: "Tech Gadgets Inc", reports: 15 },
  { id: 1236, vendorName: "Home Essentials Co", reports: 42 },
  { id: 1237, vendorName: "Sports Equipment Ltd", reports: 8 },
  { id: 1238, vendorName: "Beauty & Cosmetics", reports: 31 },
  { id: 1239, vendorName: "Bookstore Central", reports: 19 },
  { id: 1240, vendorName: "Kitchen Warehouse", reports: 27 },
  { id: 1241, vendorName: "Electronics Pro", reports: 12 },
];

export default function VendorTable() {
  const handleAction = (id: number) => {
    console.log("Action clicked for vendor ID:", id);
    // Add your action logic here
  };

  return (
    <div>
      <div className="text-indigo uppercase font-medium text-center p-6">
        No Match Found - But That's Information Too!
      </div>
      <div className="p-2 rounded-lg bg-white">
        <div className="bg-cloudWhite p-6">
          {vendorsData.map((vendor) => (
            <TableItem
              key={vendor.id}
              id={vendor.id}
              vendorName={vendor.vendorName}
              number={vendor.reports}
              action={handleAction}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TableItemProps {
  id: number;
  number: number;
  vendorName: string;
  action: (id: number) => void;
}

const TableItem: React.FC<TableItemProps> = ({
  number,
  vendorName,
  id,
  action,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-b-[#D9E6FF] border-b-solid py-4">
      <p className="font-medium">{vendorName}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray -mb-0.5">{number} reports</p>
        <button
          onClick={() => {
            action(id);
          }}
          type="button"
          className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors duration-200"
        >
          <img
            src="/assets/link-icon.svg"
            alt="View details"
            className="h-5 w-5"
          />
        </button>
      </div>
    </div>
  );
};
