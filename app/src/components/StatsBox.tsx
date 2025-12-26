const StatBox = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="bg-dark-bg/50 p-4 rounded-xl border border-dark-border hover:border-dark-muted/50 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-dark-muted text-xs uppercase font-semibold tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-xl md:text-2xl font-bold text-white truncate" title={value}>
        {value}
      </div>
    </div>
  );
};

export default StatBox;
