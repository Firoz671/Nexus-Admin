export function ShowcaseSection({ id, title, description, children }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-28 py-12 first:pt-0"
    >
      <div className="mb-6 max-w-3xl">
        <h2
          id={`${id}-title`}
          className="text-heading-2 font-semibold text-base-content"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-base-content/60">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </section>
  );
}
