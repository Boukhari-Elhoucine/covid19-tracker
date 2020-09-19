import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";
export const sortData = (data) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else return 1;
  });
  return sortedData;
};
const colorType = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204,16,52)",
    hlf_op: "rgba(204,16,52,0.5)",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125,215,29)",
    hlf_op: "rgba(125,215,29,0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251,68,67)",
    hlf_op: "rgba(251,68,67,0.5)",
    multiplier: 200,
  },
};
export const prettyPrint = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";
export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={colorType[casesType].hex}
      fillColor={colorType[casesType].hex}
      radius={Math.sqrt(country[casesType]) * colorType[casesType].multiplier}
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases : {numeral(country.cases).format("0.0")}
          </div>
          <div className="info-recovered">
            Recoverd : {numeral(country.recovered).format("0.0")}
          </div>
          <div className="info-deaths">
            Deaths : {numeral(country.deaths).format("0.0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
