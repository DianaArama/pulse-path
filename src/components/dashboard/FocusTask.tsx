const FocusTask = ({
  task,
  completed,
}: {
  task: string;
  completed: boolean;
}) => {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-[22px] border px-4 py-3 shadow-sm transition ${
        completed
          ? 'border-[#ead9cf] bg-[#f5ebe4]'
          : 'border-white/80 bg-white/90 hover:border-[#e8d6ca]'
      }`}
    >
      <input
        type='checkbox'
        className='h-4 w-4 rounded border-slate-300 accent-[#c58f79]'
        checked={completed}
        readOnly
      />
      <span
        className={`text-sm font-medium ${
          completed ? 'text-slate-500 line-through' : 'text-slate-800'
        }`}
      >
        {task}
      </span>
    </label>
  );
};

export default FocusTask;
