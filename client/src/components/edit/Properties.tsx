import "./css/Properties.css";
import {
  Stack,
  Title,
  Text,
  Center,
  Box,
  Divider,
  TextInput,
  Switch,
  ColorInput,
  NumberInput,
  SegmentedControl,
  Paper,
} from "@mantine/core";
import {
  EditPageAction,
  EditPageState,
  useEditContext,
  useEditDispatchContext,
  ColorTypes,
} from "../../context/EditContextProvider";
import { useEffect, useState } from "react";

export default function Properties() {
  const editPageState = useEditContext();
  const setEditPageState = useEditDispatchContext();
  const [groupNameState, setGroupNameState] = useState(
    editPageState.selectedRegion?.groupName
  );

  useEffect(() => {
    setGroupNameState(editPageState.selectedRegion?.groupName);
  }, [editPageState.selectedRegion]);

  return (
    <Box
      style={{
        textAlign: "left",
      }}
    >
      <Title order={3}> Map Properties </Title>

      <Stack pl={10} gap="sm" p="sm" className="mapProperties">
        <SegmentedControl
          value={editPageState.map.colorType}
          onChange={(value) => {
            setEditPageState({
              type: "update_map",
              map: { ...editPageState.map, colorType: value },
            });
          }}
          data={[
            { label: "None", value: `${ColorTypes.NONE}` },
            { label: "Choropleth", value: `${ColorTypes.CHOROPLETH}` },
            { label: "Color", value: `${ColorTypes.COLOR}` },
          ]}
        />

        <Switch
          checked={editPageState.map.displayLegend}
          onChange={(event) => {
            setEditPageState({
              type: "update_map",
              map: {
                ...editPageState.map,
                displayLegend: event.currentTarget.checked,
              },
            });
          }}
          labelPosition="left"
          label="Legend"
        />

        <Switch
          checked={editPageState.map.displayNumerics}
          onChange={(event) => {
            setEditPageState({
              type: "update_map",
              map: {
                ...editPageState.map,
                displayNumerics: event.currentTarget.checked,
              },
            });
          }}
          labelPosition="left"
          label="Numeric Label"
        />

        <Switch
          checked={editPageState.map.displayStrings}
          onChange={(event) => {
            setEditPageState({
              type: "update_map",
              map: {
                ...editPageState.map,
                displayStrings: event.currentTarget.checked,
              },
            });
          }}
          labelPosition="left"
          label="String Label"
        />
      </Stack>

      <Divider my="md" />
      <>
        {editPageState.selectedRegion && (
          <>
            <Title order={3}>
              Editing: {editPageState.selectedRegion?.region.regionName}
            </Title>
            <Title order={6}>
              Group Name ({editPageState.selectedRegion?.i}): {editPageState.selectedRegion?.groupName}
            </Title>
            <Stack pl={10} gap="xs" p="sm">
              <Title order={6}> Region Properties </Title>
              <Center></Center>
              <TextInput
                label="Group Name"
                placeholder="Group Name"
                value={groupNameState}
                onChange={(event) => {
                  setGroupNameState(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    console.log(
                      "locking in group name from ",
                      editPageState.selectedRegion!.groupName,
                      "to ",
                      groupNameState
                    );
                    setEditPageState({
                      type: "update_selected_region_group_name",
                      selectedRegion: {
                        ...editPageState.selectedRegion!,
                        groupName:
                          groupNameState === ""
                            ? editPageState.selectedRegion!.groupName
                            : groupNameState!,
                      },
                    });
                  }
                }}
              />

              <TextInput label="Region Name" placeholder="Region Name" />

              <TextInput label="String Label" placeholder="String Label" />

              <TextInput label="Numeric Label" placeholder="Numeric Label" />

              <NumberInput label="Numeric Units" placeholder="Numeric Units" />

              <ColorInput label="Input label" placeholder="#000000" />
            </Stack>
          </>
        )}
      </>
    </Box>
  );
}
