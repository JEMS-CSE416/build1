import "./css/mapHeader.css";
import { Link } from "react-router-dom";
import DownloadMapModal from "../modals/DownloadMapModal";
import DuplicateMapModal from "../modals/DuplicateMapModal";
import DeleteMapModal from "../modals/DeleteMapModal";
import { Text, Group, Avatar, Button } from "@mantine/core";
import {
  IconEdit,
  IconDownload,
  IconCopy,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

const MapHeader = () => {
  // the download modal state
  const [downloadModalOpened, setDownloadModal] = useDisclosure(false);
  // the duplicate modal state
  const [duplicateModalOpened, setDuplicateModal] = useDisclosure(false);
  // the delete modal state
  const [deleteModalOpened, setDeleteModal] = useDisclosure(false);

  return (
    <>
      {/* Show download modal when needed */}
      {downloadModalOpened && (
        <DownloadMapModal
          opened={downloadModalOpened}
          onClose={setDownloadModal.close}
        />
      )}

      {/* Show duplicate modal when needed */}
      {duplicateModalOpened && (
        <DuplicateMapModal
          opened={duplicateModalOpened}
          onClose={setDuplicateModal.close}
        />
      )}

      {/* Show delete modal when needed */}
      {deleteModalOpened && (
        <DeleteMapModal
          opened={deleteModalOpened}
          onClose={setDeleteModal.close}
        ></DeleteMapModal>
      )}

      <Text fw={500} size="sm" id="creationDate">
        Created 5 days ago
      </Text>
      <Text fw={700} size="xl" id="title">
        Best Places to Eat in The East Blue
      </Text>
      <Group id="edit">
        <Link to="/edit" style={{ marginLeft: "auto" }}>
          <Button
            leftSection={<IconEdit size={14} />}
            variant="subtle"
            color="gray"
            id="edit-button"
          >
            Edit Map
          </Button>
        </Link>
        <Button
          leftSection={<IconTrash size={14} />}
          variant="subtle"
          color="gray"
          onClick={setDeleteModal.open}
          id="delete-button"
        >
          Delete
        </Button>
      </Group>

      <Group>
        <Group>
          <Avatar color="blue" radius="xl">
            L
          </Avatar>
          <div>
            <Text fw={500} size="sm" id="creatorName">
              @Luffy
            </Text>
            <Text size="xs" c="dimmed" id="numberMaps">
              10 maps
            </Text>
          </div>
        </Group>
        <Group style={{ marginLeft: "auto" }}>
          <Button
            leftSection={<IconDownload size={14} />}
            variant="subtle"
            color="gray"
            onClick={setDownloadModal.open}
            id="download-button"
          >
            Download
          </Button>

          <Button
            leftSection={<IconCopy size={14} />}
            variant="subtle"
            color="gray"
            onClick={setDuplicateModal.open}
            id="duplicate-button"
          >
            Duplicate
          </Button>
        </Group>
      </Group>
    </>
  );
};

export default MapHeader;
