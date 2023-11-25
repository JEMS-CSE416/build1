import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./css/searchedMapsScreen.css";
import NavBar from "../common/Navbar";
import Footer from "../common/Footer";
import { Box, Text, Group, Stack, Image } from "@mantine/core";
import nothingHere from "../../assets/images/NothingHere.svg";
import MapCard from "./MapCard";
import { getMaps } from "../../api/MapApiAccessor";
import { Map } from "../../utils/models/Map";
import { useDisclosure } from "@mantine/hooks";
import DuplicateMapModal from "../modals/DuplicateMapModal";

const NothingHere = () => {
  return (
    <Stack align="center" id="nothingHereStack">
      <Image src={nothingHere} w={300} h={300} />
      <Text size="lg" fw={500} id="nothingHereText">
        Nothing here yet
      </Text>
      <Text size="sm" id="nothingHereText" c="dimmed" w={250}>
        No results found. Try searching for something else!
      </Text>
    </Stack>
  );
};

const SearchedMapsScreen = () => {
  const { search } = useParams();
  const location = useLocation();
  const [duplicateModalOpened, setDuplicateModal] = useDisclosure(false);
  const [maps, setMaps] = useState<Map[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const queryForMaps = async () => {
      try {
        const responseData = await getMaps({
          isPrivate: false,
          mapName: `${search}`,
        });
        console.log("Maps searched successfully:", responseData);
        setMaps(responseData);
      } catch (error) {
        console.error("Error searching for maps:", error);
      }
    };

    queryForMaps();
  }, [search, location.state]);

  if (!search) {
    navigate("/");
  }

  const handleSelectMapToDuplicate = (map: Map) => {
    console.log("Selected map to duplicate:", map);
    // setSelectedMapToDuplicate(map);
    location.state = map;
    setDuplicateModal.open();
  };

  return (
    <>
      <DuplicateMapModal
        opened={duplicateModalOpened}
        onClose={setDuplicateModal.close}
      />
      <NavBar />
      <div className="container">
        <Group>
          <Text
            fw={700}
            size="xl"
            id="searchedHeader"
            ta="left"
            className="text-blue"
            style={{ width: "50%" }}
          >
            Showing results for
            <Text span fw={700} size="xl" ta="left" className="text-black">
              {" "}
              {search}
            </Text>
          </Text>
        </Group>
        <Group>
          {maps.length === 0 ? (
            <Box mx="auto">
              <NothingHere />
            </Box>
          ) : (
            maps.map((map) => (
              <Group justify="flex-start">
                <MapCard
                  id={map._id}
                  name={map.mapName}
                  description={map.description}
                  isPrivate={!map.public}
                  map={map}
                  duplicateAction={() => {
                    handleSelectMapToDuplicate(map);
                  }}
                />
              </Group>
            ))
          )}
        </Group>
      </div>
      <Footer />
    </>
  );
};

export default SearchedMapsScreen;
