import "../styles/widget.scss";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DevicesIcon from '@mui/icons-material/Devices';
import React from "react"

const Widget = ({ type, count }) => {
  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              fontSize: "50px"
            }}
          />
        ),
      };
      break;
    case "employee":
      data = {
        title: "EMPLOYEES",
        isMoney: false,
        link: "View all orders",
        icon: (
          <PeopleAltIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
              fontSize: "50px"
            }}
          />
        ),
      };
      break;
    case "device":
      data = {
        title: "DEVICES",
        isMoney: true,
        link: "View net earnings",
        icon: (
          <DevicesIcon
            className="icon"
            style={{ 
              backgroundColor: "rgba(0, 128, 0, 0.2)", 
              color: "green",
              fontSize: "50px" 
          }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data?.title}</span>
        <span className="counter">
          {count}
        </span>
      </div>
      <div className="right">
        {data?.icon}
      </div>
    </div>
  );
};

export default Widget;
