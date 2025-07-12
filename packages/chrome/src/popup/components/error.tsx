export const ErrorUI = ({ error }: { error: string }) => {
  return (
    <div className="text-red-600  rounded-md bg-red-50 text-xs p-2 mt-2">
      {error}
    </div>
  );
};