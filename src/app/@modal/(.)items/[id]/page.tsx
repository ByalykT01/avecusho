import FullItemImageView from "~/components/full-item-page";
import { Modal } from "./modal";

export default function ItemModal({
  params: { id: itemId },
}: {
  params: { id: string };
}) {
  const intItemId = Number(itemId);
  if (Number.isNaN(intItemId)) throw new Error("Invalid item ID");
  return (
    <Modal>
      <FullItemImageView id={intItemId} />
    </Modal>
  );
}
