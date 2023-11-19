import "./css/homeScreen.css";
import { Group, Text, Stack, Box, Button, Image, Grid } from "@mantine/core";
import MapCard from "../browsing/MapCard";
import NavBar from "../common/Navbar";
import Footer from "../common/Footer";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import ellipses from "../../assets/images/ellipses.png";
import { getMaps } from "../../api/MapApiAccessor";
import { Map } from "../../utils/models/Map";


const HomePage = () => {
  const [maps, setMaps] = useState<Map[]>([]);

  useEffect(() => {
    getPublicMaps();
  }, []);

  const getPublicMaps = async () => {
    try {
      const responseData = await getMaps({isPrivate: false});
      console.log("Data updated successfully:", responseData);
      setMaps(responseData);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const getYourMaps = async () => {
    try {
      const responseData = await getMaps({});
      console.log("Data updated successfully:", responseData);
      setMaps(responseData);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  } 


  const cardSpan = { base: 12, sm: 6, md: 6, lg: 4, xl: 3 };

  return (
    <>
      <NavBar></NavBar>
      <div id="content">
        <Stack>
          <Box>
            <Stack gap="xs">
              <Group id="homePageHeaderGroup">
                <Text
                  fw={700}
                  size="xl"
                  id="homePageHeader"
                  ta="left"
                  style={{ width: "50%" }}
                >
                  Your Maps
                </Text>
                <Link to="/myMaps" id="seeAllLink">
                  <Text size="sm" ta="right">
                    See all{" "}
                  </Text>
                </Link>
              </Group>
              <Grid style={{ textAlign: "initial" }}>
                <Grid.Col span={cardSpan}>
                  <Link to="/selected">
                    <MapCard id="MyMapCard1" isPrivate={false} />
                  </Link>
                </Grid.Col>
                <Grid.Col span={cardSpan}>
                  <Link to="/selected">
                    <MapCard id="MyMapCard2" isPrivate={false} />
                  </Link>
                </Grid.Col>
                <Grid.Col span={cardSpan}>
                  <Link to="/selected">
                    <MapCard id="MyMapCard3" isPrivate={true} />
                  </Link>
                </Grid.Col>
                <Grid.Col span={cardSpan}>
                  <Link to="/selected">
                    <MapCard id="MyMapCard4" isPrivate={false} />
                  </Link>
                </Grid.Col>
              </Grid>
            </Stack>
          </Box>
          <Box>
            <Stack gap="xs">
              <Group id="homePageHeaderGroup">
                <Text
                  fw={700}
                  size="xl"
                  id="homePageHeader"
                  ta="left"
                  style={{ width: "50%" }}
                >
                  {" "}
                  Discover Maps{" "}
                </Text>
                <Link to="/discover" id="seeAllLink">
                  <Text size="sm" ta="right">
                    See all{" "}
                  </Text>
                </Link>
              </Group>
              <Grid style={{ textAlign: "initial" }}>
                {maps.map((map) => (
                  <Grid.Col span={cardSpan}>
                    <MapCard isPrivate={!map.public} name={map["mapName"]} description={map.description}/>
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>
          </Box>
        </Stack>
      </div>
      <Footer></Footer>
    </>
  );
};

export default HomePage;
