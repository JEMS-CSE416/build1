import React, { createContext, useContext, useEffect, useReducer } from "react";
import { ErrorMap, Map as JemsMap, Region } from "../utils/models/Map";
import { BACKEND_URL } from "../utils/constants";
import { update } from "cypress/types/lodash";
import { getMap } from "../api/MapApiAccessor";
import { EditModalEnum } from "../utils/enums";
import chroma from "chroma-js";

interface EditContextProviderProps {
  children?: React.ReactNode;
  map_id?: string; // TODO: remove the optional portion
}

export interface EditPageState {
  map: JemsMap;
  selectedRegion?: {
    groupName: string; // does not change when being edited. Only changes when user edits and locks it in by pressing enter.
    i: number;
    region: Region;
  };
  modal: String;
}

export interface EditPageAction {
  type: String;
  map?: JemsMap;
  modal?: String;
  selectedRegion?: {
    groupName: string;
    i: number;
    region: Region;
  };
}

// Constant initialization
const initState = {
  map: ErrorMap,
  selectedRegion: undefined,
  modal: "NONE",
};

export const EditContext = createContext<EditPageState>(initState);
export const EditDispatchContext = createContext<
  React.Dispatch<EditPageAction>
>(() => {});

/*
 * EditContextProvider component.
 * Children will attempt to access the state of the edit page by calling:
 *    const editState = useContext(EditState)
 * Children will attempt to change state through the reducer through methods:
 *    const dispatch = useContext(EditDispatchcontext)
 *    dispatch({
 *
 *    })
 */
export function EditContextProvider(props: EditContextProviderProps) {
  const [editPageState, dispatch] = useReducer(editReducer, initState);

  // initialize the map by pulling it from the backend
  useEffect(() => {
    fetchMap();
    AppendChoroplethLegendItems(
      editPageState,
      editPageState.map.legend.choroplethLegend.hue
    );
  }, []);

  const fetchMap = async () => {
    // Replace with your API endpoint and map ID
    const mapId = props.map_id;

    try {
      console.log(`fetching map for id: ${mapId}`);
      const res = await getMap({ id: mapId as string });
      const newMap = res;

      // Append choropleth legend items to the newly created map
      const newItems = AppendChoroplethLegendItems(
        editPageState,
        newMap.legend.choroplethLegend.hue
      );
      newMap.legend.choroplethLegend = {
        ...editPageState.map.legend.choroplethLegend,
        items: newItems,
      };

      console.log("newMap", newMap);
      dispatch({
        type: "init_map",
        map: newMap,
      });
    } catch (error) {
      console.error("Error fetching map:", error);
    }
  };

  return (
    <EditContext.Provider value={editPageState}>
      <EditDispatchContext.Provider value={dispatch}>
        {props.children}
      </EditDispatchContext.Provider>
    </EditContext.Provider>
  );
}

// Function that arbitrarily appends 5 new items to choropleth legend based on the max value. If the max value is less than five, it will append the max value number of items.
export function AppendChoroplethLegendItems(
  editPageState: EditPageState,
  newHue: string,
  updatedMin?: number,
  updatedMax?: number
) {
  let minVal: number;
  let maxVal: number;
  updatedMin
    ? (minVal = updatedMin)
    : (minVal = editPageState.map.legend.choroplethLegend.min);
  updatedMax
    ? (maxVal = updatedMax)
    : (maxVal = editPageState.map.legend.choroplethLegend.max);
  const newItems = new Map<string, number>();
  let value = 0;
  let color = chroma(newHue).brighten(value).hex();

  // set the first item to the max value
  newItems.set(color, maxVal);

  if (maxVal >= 5) {
    // set the middle items if max is greater or equal to 5
    for (let i = 1; i < 4; i++) {
      value += 0.5;
      color = chroma(newHue).brighten(value).hex();
      newItems.set(color, maxVal - i);
    }
  } else {
    // set the middle items if max is less than 5
    for (let i = 1; i < maxVal; i++) {
      value += 0.5;
      color = chroma(newHue).brighten(value).hex();
      newItems.set(color, maxVal - i);
    }
  }

  // set the last item to the min value
  value += 0.5;
  color = chroma(newHue).brighten(value).hex();
  newItems.set(color, minVal);

  const newItemsObject = Array.from(newItems).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {} as { [key: string]: number });

  return newItemsObject;
}

// TODO: change any action
// This function handles all of the changes to the edit page state
function editReducer(state: EditPageState, action: any): EditPageState {
  switch (action.type) {
    case "init_map":
      // Make sure you create a new state, rather than modify the old one
      // Creating new state ensures that componenents will re-render
      return {
        ...state,
        map: action.map ?? ErrorMap,
      };
    case "change_modal":
      return {
        ...state,
        modal: Object.values(EditModalEnum).includes(action.modal)
          ? action.modal
          : "NONE",
      };
    case "update_map":
      return {
        ...state,
        map: action.map ?? ErrorMap,
      };
    case "select_region":
      const selectedRegion = {
        i: action.selectedRegion.i,
        groupName: action.selectedRegion.groupName,
        region: action.selectedRegion.region,
      };

      return {
        ...state,
        selectedRegion: selectedRegion,
      };
    case "update_selected_region_info":
      const oldGroupName = state.selectedRegion!.groupName;
      const newGroupName = action.selectedRegion.groupName;
      const newRegions = { ...state.map.regions };

      let updatedSelectedRegionInfo = {
        i: action.selectedRegion.i,
        groupName: action.selectedRegion.groupName,
        region: action.selectedRegion.region,
      };

      // Update region info first then move groups if necessary
      newRegions[oldGroupName][state.selectedRegion!.i].regionName =
        action.selectedRegion.region.regionName;
      newRegions[oldGroupName][state.selectedRegion!.i].stringLabel =
        action.selectedRegion.region.stringLabel;
      newRegions[oldGroupName][state.selectedRegion!.i].numericLabel =
        action.selectedRegion.region.numericLabel;
      newRegions[oldGroupName][state.selectedRegion!.i].numericUnit =
        action.selectedRegion.region.numericUnit;
      newRegions[oldGroupName][state.selectedRegion!.i].color =
        action.selectedRegion.region.color;

      // If the group name has changed then move the region to the new group
      if (newGroupName !== oldGroupName) {
        if (newGroupName in newRegions) {
          // If the groupName exists
          console.log("adding to existing group: ", newGroupName);
          //update the corresponding region to have the region.
          newRegions[newGroupName] = [
            ...newRegions[newGroupName],
            action.selectedRegion.region,
          ];
          // update the selected region info so we are currently viewing the updated region.
          updatedSelectedRegionInfo.groupName = newGroupName;
          updatedSelectedRegionInfo.i = newRegions[newGroupName].length - 1;
          updatedSelectedRegionInfo.region =
            newRegions[newGroupName][newRegions[newGroupName].length - 1];

          // Then remove the old region from the old group.
          newRegions[oldGroupName] = newRegions[oldGroupName].filter(
            (_, i) => i !== action.selectedRegion.i
          );

          // If the old group is now empty then remove it.
          if (newRegions[oldGroupName].length === 0) {
            delete newRegions[oldGroupName];
          }
        } else {
          // If the groupName doesn't exist
          console.log("adding new group: ", newGroupName);
          // add a new group to the regions map and add the region to the group.
          // also update the selected region info so we are currently viewing the updated region.
          newRegions[newGroupName] = [action.selectedRegion.region];
          updatedSelectedRegionInfo.groupName = newGroupName;
          updatedSelectedRegionInfo.i = 0;
          updatedSelectedRegionInfo.region = newRegions[newGroupName][0];

          // then remove the region from the old group.
          newRegions[oldGroupName] = newRegions[oldGroupName].filter(
            (_, i) => i !== action.selectedRegion.i
          );
          // If the old group is now empty then remove it.
          if (newRegions[oldGroupName].length === 0) {
            delete newRegions[oldGroupName];
          }
        }
      }

      const minMaxValues = findChoroplethLegendMinMax(state);
      // Get the old choropleth legend and update it with a new legend that includes the new min and max values
      const oldChoroplethLegend = state.map.legend.choroplethLegend;
      let updatedChoroplethLegend = {
        ...oldChoroplethLegend,
        min: minMaxValues.minValue,
        max: minMaxValues.maxValue,
        hue: action.map.legend.choroplethLegend.hue,
      };

      const choroplethItems = AppendChoroplethLegendItems(
        state,
        updatedChoroplethLegend.hue,
        minMaxValues.minValue,
        minMaxValues.maxValue
      );
      updatedChoroplethLegend = {
        ...updatedChoroplethLegend,
        items: choroplethItems,
      };

      console.log("updated state: ", {
        ...state,
        map: {
          ...state.map,
          regions: newRegions,
          legend: {
            ...state.map.legend,
            choroplethLegend: updatedChoroplethLegend,
          },
        },
        selectedRegion: updatedSelectedRegionInfo,
      });

      return {
        ...state,
        map: {
          ...state.map,
          regions: newRegions,
          legend: {
            ...state.map.legend,
            choroplethLegend: updatedChoroplethLegend,
          },
        },
        selectedRegion: updatedSelectedRegionInfo,
      };
    case "update_map":
      return {
        ...state,
        map: action.map,
      };
    case "update_color_legend":
      return {
        ...state,
        map: {
          ...state.map,
          legend: {
            ...state.map.legend,
            colorLegend: action.map.legend.colorLegend,
          },
        },
      };
    case "update_choropleth_legend":
      const oldChoroplethLegend2 = state.map.legend.choroplethLegend;
      let updatedChoroplethLegend2 = {
        ...oldChoroplethLegend2,
        hue: action.map.legend.choroplethLegend.hue,
      };

      const choroplethItems2 = AppendChoroplethLegendItems(
        state,
        updatedChoroplethLegend2.hue
      );
      updatedChoroplethLegend2 = {
        ...updatedChoroplethLegend2,
        items: choroplethItems2,
      };

      return {
        ...state,
        map: {
          ...state.map,
          legend: {
            ...state.map.legend,
            choroplethLegend: updatedChoroplethLegend2,
          },
        },
      };
  }
  return state;
}

/* Function that finds the min and max values for the choropleth legend */
function findChoroplethLegendMinMax(state: EditPageState) {
  let minValue = Number.MAX_SAFE_INTEGER;
  let maxValue = Number.MIN_SAFE_INTEGER;
  // let numericLabelMap = new JemsMap<number | string, number>();
  const regions = state.map.regions;
  const filename = Object.keys(regions);

  // Iterate through each region filename and find the min and max values
  for (let i = 0; i < filename.length; i++) {
    const region = regions[filename[i]];
    for (let j = 0; j < region.length; j++) {
      const numericLabel = region[j].numericLabel;
      const numericLabelNumber = Number(numericLabel);
      if (numericLabel === "") continue;
      if (numericLabelNumber < minValue) {
        minValue = numericLabelNumber;
      }
      if (numericLabelNumber > maxValue) {
        maxValue = numericLabelNumber;
      }
      // numericLabelMap.set(numericLabel, numericLabelNumber);
    }
  }
  // console.log(numericLabelMap);
  console.log(minValue);
  console.log(maxValue);

  return { minValue, maxValue };
}

export function useEditContext() {
  return useContext(EditContext);
}

export function useEditDispatchContext() {
  return useContext(EditDispatchContext);
}
