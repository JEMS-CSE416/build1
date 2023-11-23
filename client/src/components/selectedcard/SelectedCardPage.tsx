import "./css/selectedCardPage.css";
import NavBar from "../common/Navbar";
import MapHeader from "./MapHeader";
import Canvas from "./Canvas";
import MapAbout from "./MapAbout";
import Comments from "./Comments";
import Footer from "../common/Footer";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Map } from "../../utils/models/Map";

/* Custom React Hook, selectedMap content can now be accessed without passing as a prop */
export const useSelectedMap = () => {
  const location = useLocation();
  const selectedMap = location.state;
  return selectedMap;
};

const SelectedCardPage = ({}) => {
  const { id } = useParams();
  const [map, setMap] = useState<Map>();

  useEffect(() => {
    // fetch map data from backend
    // set map.
  }, []);

  const selectedMap: Map = useSelectedMap();
  console.log("Selected Map Details");
  console.log(selectedMap);

  return (
    <>
      <NavBar></NavBar>
      <div id="content">
        <MapHeader></MapHeader>
        <Canvas></Canvas>
        <MapAbout></MapAbout>
        <Comments></Comments>
      </div>
      <Footer></Footer>
    </>
  );
};

export default SelectedCardPage;
