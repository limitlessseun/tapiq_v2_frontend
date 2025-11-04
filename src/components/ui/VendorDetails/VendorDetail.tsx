import { AiFillInstagram } from "react-icons/ai";
import { Button } from "../button";

interface VendorDetailProps {
  showButton?: boolean;
}

const VendorDetail:React.FC<VendorDetailProps>=()=> {
  return (
    <div className="p-6 bg-white rounded-3xl flex flex-col gap-6">
      <div>
        <div className="flex flex-col  items-start">
          <p className="text-sm text-gray pb-1 ">Name(s):</p>
          <p className="text-base text-indigo ">
            Luxury Fashion Hub, Luxury Hub, Fashion Hub
          </p>
        </div>
      </div>
      <div>
        <div className="flex flex-col  items-start">
          <p className="text-sm text-gray pb-1 ">Phone Number(s): </p>
          <p className="text-base text-indigo ">
            0801-234-5678, 0801-234-5678, 0801-234-5678{" "}
          </p>
        </div>
      </div>
      <div>
        <div className="flex flex-col  items-start">
          <p className="text-sm text-gray pb-1 ">Platforms: </p>
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <AiFillInstagram className="text-white" />
              </span>
              <span className="text-b text-sm ">@jdhdkkd</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <AiFillInstagram className="text-white" />
              </span>
              <span className="text-b text-sm ">@fashionmmm</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <AiFillInstagram className="text-white" />
              </span>
              <span className="text-b text-sm "> www.luxuryfashionhub.com</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col  items-start">
          <p className="text-sm text-gray pb-1 ">Crypto Wallet ID : </p>
          <p className="text-base text-indigo ">
            1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71{" "}
          </p>
        </div>
      </div>
      <div>
        <div className="flex flex-col  items-start">
          <p className="text-sm text-gray pb-1 ">Last Report: </p>
          <p className="text-base text-indigo ">3 hours ago </p>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="uppercase text-xs w-full"
        onClick={() => {}}
      >
        Remove{" "}
      </Button>
    </div>
  );
}

export default VendorDetail