import React from "react";

interface SafeTipsProps {
  genuine: boolean;
}
const Indicators: React.FC<SafeTipsProps> = ({ genuine }) => {
  return (
    <div>
      <div className="text-center ">
        <div className="flex items-center justify-center gap-4 ">
          <img
            src={genuine ? "/assets/guard.svg" : "assets/danger.svg"}
            className="h-5 w-5"
          />
          <h3 className="font-bold text-indigo text-2xl ">
            {genuine ? "Looks Safe!" : "Exercise Caution!"}{" "}
          </h3>
        </div>
        <p className="text-gray  text-center">
          {genuine
            ? "The message does not appear to be a scam"
            : "This message shows signs of potential fraud."}
        </p>
        <p></p>
      </div>
      <div className="rounded-3xl overflow-hidden relative my-6">
        <img
          src={genuine ? "/assets/success.jpg" : "/assets/dangerBackground.jpg"}
          className="h-[150px] w-full"
        />
        <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6">
          {/* Safety Score Section */}
          <div className="flex flex-col justify-between h-[150px] py-6">
            <p className={`${genuine ? "text-[#525C76]" : "text-white"}`}>
              Safety Score:
            </p>
            <h3
              className={`font-bold ${
                genuine ? "text-indigo" : "text-white"
              } px-0`}
              style={{
                fontSize: "40px",
              }}
            >
              8.7/10
            </h3>
          </div>

          {/* Divider */}
          <div className="h-[83px] w-px bg-white"></div>

          {/* Analysis Time Section */}
          <div className="flex flex-col justify-between h-[150px] py-6">
            <p className={`${genuine ? "text-[#525C76]" : "text-white"}`}>
              Analysis completed in
            </p>
            <div className="flex items-end">
              <h3
                className={`font-bold ${
                  genuine ? "text-indigo" : "text-white"
                }`}
                style={{
                  fontSize: "40px",
                }}
              >
                2.1
              </h3>
              <span
                className={`${genuine ? "text-[#525C76]" : "text-white"} pb-3`}
              >
                {" "}
                seconds
              </span>
            </div>
          </div>
        </div>
      </div>
      {genuine ? <Positive /> : <Negative />}
    </div>
  );
};

export default Indicators;

const Positive = () => {
  const data = [
    "Contains a legitimate order reference",
    "Official domain link (tapiq.ng)",
    "Verifiable customer service number",
  ];
  return (
    <div>
      {" "}
      <h3 className="font-bold text-indigo ">Positive indicators found:</h3>
      <div className="flex flex-col items-center gap-2">
        {data.map((item, index) => (
          <div className="bg-white p-1 rounded w-full">
            <div
              className=" rounded  bg-linear-to-br from-[#FFFFFF] to-[#E1EAFD]"
              key={index}
            >
              <p className="text-sm text-gray flex items-center gap-2 p-2">
                <img src="/assets/checkmark.svg" className="h-4 w-4" /> {item}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const Negative = () => {
  const data = [
    `Creates false urgency ("URGENT!!!") `,
    `Requests upfront payment for "winnings" `,
    "Unsolicited lottery/prize notification ",
  ];
  return (
    <div>
      {" "}
      <h3 className="font-bold text-indigo ">Red Flags Detected:</h3>
      <div className="flex flex-col items-center gap-2">
        {data.map((item, index) => (
          <div className="bg-white p-1 rounded w-full">
            <div
              className=" rounded  bg-linear-to-br from-[#FFFFFF] to-[#E1EAFD]"
              key={index}
            >
              <p className="text-sm text-gray flex items-center gap-2 p-2">
                <img src="/assets/danger-mark.svg" className="h-4 w-4" /> {item}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
