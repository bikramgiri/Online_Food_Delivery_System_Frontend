const Checkbox = (props) => {
  const { extra, color, ...rest } = props;

  // Map colorScheme to color if provided, otherwise use color
  const effectiveColor = color || (props.colorScheme === "brandScheme" ? "brand" : null);

  return (
    <input
      type="checkbox"
      className={`defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center 
      justify-center rounded-md border border-gray-500 text-gray-500 outline-none transition duration-[0.2s]
      checked:border-none checked:text-black hover:cursor-pointer dark:border-white/10 ${
        effectiveColor === "red"
          ? "checked:border-none checked:bg-red-500 dark:checked:bg-red-400"
          : effectiveColor === "blue"
          ? "checked:border-none checked:bg-blue-500 dark:checked:bg-blue-400"
          : effectiveColor === "green"
          ? "checked:border-none checked:bg-green-500 dark:checked:bg-green-400"
          : effectiveColor === "yellow"
          ? "checked:border-none checked:bg-yellow-500 dark:checked:bg-yellow-400"
          : effectiveColor === "orange"
          ? "checked:border-none checked:bg-orange-500 dark:checked:bg-orange-400"
          : effectiveColor === "teal"
          ? "checked:border-none checked:bg-teal-500 dark:checked:bg-teal-400"
          : effectiveColor === "navy"
          ? "checked:border-none checked:bg-navy-500 dark:checked:bg-navy-400"
          : effectiveColor === "lime"
          ? "checked:border-none checked:bg-lime-500 dark:checked:bg-lime-400"
          : effectiveColor === "cyan"
          ? "checked:border-none checked:bg-cyan-500 dark:checked:bg-cyan-400"
          : effectiveColor === "pink"
          ? "checked:border-none checked:bg-pink-500 dark:checked:bg-pink-400"
          : effectiveColor === "purple"
          ? "checked:border-none checked:bg-purple-500 dark:checked:bg-purple-400"
          : effectiveColor === "amber"
          ? "checked:border-none checked:bg-amber-500 dark:checked:bg-amber-400"
          : effectiveColor === "indigo"
          ? "checked:border-none checked:bg-indigo-500 dark:checked:bg-indigo-400"
          : effectiveColor === "gray"
          ? "checked:border-none checked:bg-gray-500 dark:checked:bg-gray-400"
          : "checked:bg-brand-500 dark:checked:bg-brand-400"
      } ${extra}`}
      name="weekly"
      {...rest}
    />
  );
};

export default Checkbox;