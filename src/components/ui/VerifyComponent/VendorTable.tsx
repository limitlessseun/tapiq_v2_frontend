import React, { useState } from "react";
import { Button } from "../button";
import AnimatedModalLayout from "@/layout/animatedModalLayout";

// Vendor data array

interface VendorTableProps {
  data: { id: number; vendorName: string; reports: number }[];
}

const VendorTable: React.FC<VendorTableProps> = ({ data }) => {
  const handleAction = (id: number) => {
    console.log("Action clicked for vendor ID:", id);
    // Add your action logic here
  };

  return (
    <div>
      {data.length < 1 && (
        <div className=" uppercase font-medium text-center p-6 text-primary font-satoshi">
          No Match Found - But That's Information Too!
        </div>
      )}
      {data.length > 0 && (
        <div className="p-2 rounded-lg bg-white">
          <div className="bg-cloudWhite p-6 font-satoshi">
            {data.map((vendor) => (
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
      )}
    </div>
  );
};

export default VendorTable;

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
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="flex items-center justify-between border-b border-b-[#D9E6FF] border-b-solid py-4">
      <p className="font-medium">{vendorName}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray -mb-0.5">{number} reports</p>
        <button
          onClick={() => {
            // action(id);
            setShowModal(true);
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
      {showModal && (
        <AnimatedModalLayout>
          <ReportVendorModal closeModal={() => setShowModal(false)} />
        </AnimatedModalLayout>
      )}
    </div>
  );
};

interface ReportVendorModalProps {
  closeModal: () => void;
}

const ReportVendorModal: React.FC<ReportVendorModalProps> = ({
  closeModal,
}) => {
  return (
    <div className="p-6 text-center flex flex-col items-center gap-2">
      <h3 className="font-bold text-indigo">
        Are you sure you want to add @luxurybags_ng to your Watchlist?
      </h3>

      <p className="text-gray text-sm font-satoshi">
        You won’t see any current reports, but if this vendor gets flagged in
        the future, you’ll receive real-time alerts to help you stay safe.
      </p>

      <div className="flex items-center mt-6 gap-4 w-full">
        <div className="flex-1">
          <Button
            variant="outline"
            size="lg"
            className="uppercase text-xs w-full"
            style={{
              border: "1px solid",
              borderImage: `
                  linear-gradient(180deg, rgba(255, 255, 255, 0.8) -25.96%, rgba(255, 255, 255, 0) 100%),
                  linear-gradient(270deg, rgba(255, 255, 255, 0) 12.54%, rgba(255, 255, 255, 0.8) 47.67%, rgba(255, 255, 255, 0) 82.8%)
                  1
                `,
            }}
            onClick={closeModal}
          >
            Cancel{" "}
          </Button>
        </div>
        <div className="flex-1">
          <Button
            variant="primary"
            size="lg"
            className="uppercase text-xs w-full"
            onClick={() => { }}
          >
            Confirm{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};
