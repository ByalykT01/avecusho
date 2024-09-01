import FullItemImageView from "~/components/full-item-page";

export default function ItemPage({
  params: { id: itemId },
}: {
  params: { id: string };
}) {
  const intItemId = Number(itemId);
  if (Number.isNaN(intItemId)) throw new Error("Invalid item ID");
  return <FullItemImageView id={intItemId} />;
}