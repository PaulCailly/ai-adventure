export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <body className="max-w-[430px] h-[800px] mx-auto overflow-hidden border border-gray-200">
        {children}
      </body>
    </>
  );
}
