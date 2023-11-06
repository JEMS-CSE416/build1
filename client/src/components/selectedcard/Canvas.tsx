import { Image } from "@mantine/core";
import "../css/canvas.css";
const Canvas = () => {
  return (
    <>
      <Image
        id="mapImage"
        style={{marginTop:"20px"}}
        src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
      ></Image>
    </>
  );
};

export default Canvas;
