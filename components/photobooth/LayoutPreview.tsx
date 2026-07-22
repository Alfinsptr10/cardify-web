type Props = {
  photos: number;
};

export default function LayoutPreview({ photos }: Props) {
  return (
    <div className="mx-auto flex aspect-[1/3] w-28 rounded-[24px] bg-white p-3 shadow">

      {photos === 4 ? (
        <div className="grid w-full grid-cols-2 gap-2">
          <div className="rounded-lg bg-gray-200"></div>
          <div className="rounded-lg bg-gray-200"></div>
          <div className="rounded-lg bg-gray-200"></div>
          <div className="rounded-lg bg-gray-200"></div>
        </div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-2">
          <div className="rounded-lg bg-gray-200"></div>
          <div className="rounded-lg bg-gray-200"></div>
          <div className="rounded-lg bg-gray-200"></div>
          <div className="rounded-lg bg-gray-200"></div>
          <div className="rounded-lg bg-gray-200"></div>
          <div className="rounded-lg bg-gray-200"></div>
        </div>
      )}

    </div>
  );
}