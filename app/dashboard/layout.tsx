import { ensureCategoriesExist } from "../db/actions/budget";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // On s'assure que la structure est prête en base de données
  await ensureCategoriesExist();

  return <section>{children}</section>;
}
