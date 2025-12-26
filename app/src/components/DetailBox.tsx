const DetailBox = ({
  label,
  value,
  className = '',
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      <p className="text-dark-muted text-xs uppercase font-bold tracking-wider mb-1">{label}</p>
      <div className="text-white font-medium text-lg break-words">{value}</div>
    </div>
  );
};

export default DetailBox;
